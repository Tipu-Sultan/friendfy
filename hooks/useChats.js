import { useDispatch, useSelector } from "react-redux";
import crypto from "crypto";
import {
  fetchMessages,
  sendMessages,
  setContent,
  deleteMessage,
  updateDeleteMessage,
  updateRecentChats,
} from "../redux/slices/chatSlice";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";

export const useChat = (user,client) => {
  const dispatch = useDispatch();
  const { recentChats, messages, selectedUser, chatLoading, error, content } =
    useSelector((state) => state.chat);
  const [contentType, setContentType] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);



  const stableSelectedUser = useMemo(() => selectedUser, [selectedUser]);
  const stableUser = useMemo(() => user, [user]);

  const channelName =
    stableSelectedUser?.type === "group"
      ? stableSelectedUser.id
      : [stableUser?.id, stableSelectedUser?.id].sort().join("-");
  const chatChannel = client?.channels?.get(channelName);

  const sendTypingEvent = (isTyping) => {
    chatChannel.publish("typing", {
      userId: stableSelectedUser?.id,
      currentUser: stableUser?.id,
      userName: stableUser?.username, // Send name for group typing
      isTyping,
    });
  };

  const handleMessageSend = (sender, receiver, type) => {
    const tempId = crypto.randomBytes(6).toString("hex").toUpperCase(); // Generate a temporary unique ID

    const senderType =
      type === "group"
        ? {
            _id: stableUser?.id,
            username: user?.username,
            profilePicture: user?.profilePicture,
          }
        : sender;

    const reduxPayload = {
      type,
      tempId,
      sender: senderType,
      receiver,
      content,
      contentType: contentType || "text/plain",
      media: null,
      isRead: false,
      reactions: [],
      deletedBySender: false,
      deletedByReceiver: false,
      edited: false,
      editedAt: null,
      status: "pending", // Optimistic status
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const messagePayload = {
      type,
      tempId,
      sender,
      receiver,
      content,
      contentType: contentType || "text/plain",
      media: null,
      status: "pending",
    };

    // Optimistically add the message to Redux
    dispatch({
      type: "chat/addMessage",
      payload: { message: reduxPayload },
    });

    chatChannel?.publish("new-message", reduxPayload);

    // Send the message to the server (Assuming sendMessages handles the API call)
    dispatch(sendMessages(messagePayload));

    // Clear the input field
    dispatch(setContent(""));
  };

  // Memoize the loadMessages function
  const loadMessages = useCallback(
    (sender, receiver, type) => {
      if (!sender || !receiver) return; // ✅ Prevent invalid API calls
      dispatch(fetchMessages({ sender, receiver, page: 1, type }));
    },
    [] // ✅ Removed `dispatch` since it's stable in Redux
  );
  

  useEffect(() => {
    if (!stableSelectedUser?.id || !stableSelectedUser?.type) return; // ✅ Prevent unnecessary calls
  
    let timeout = setTimeout(() => {
      loadMessages(stableUser?.id, stableSelectedUser?.id, stableSelectedUser?.type);
    }, 100); // ✅ Debounce to prevent multiple calls in quick succession
  
    return () => clearTimeout(timeout); // ✅ Cleanup previous call if user changes quickly
  }, [loadMessages, stableSelectedUser?.id, stableSelectedUser?.type]); 
  

  // Listen for message acknowledgments and delivery
  useEffect(() => {
    if (!chatChannel) return;

    const handleIncomingMessage = (message) => {
      dispatch({ type: "chat/addMessage", payload: { message: message.data } });
      dispatch({ type: "chat/updateRecentChats", payload: { message: message.data } });
    };

    chatChannel.subscribe("new-message", handleIncomingMessage);

    return () => {
      chatChannel.unsubscribe("new-message", handleIncomingMessage);
    };
  }, [chatChannel, dispatch]);

  const handleMsgDelete = (msgId, senderId, isSender) => {
    chatChannel?.publish("message-deleted", { msgId, isSender });
    dispatch(
      deleteMessage({
        msgId,
        senderId,
        isSender,
        type: stableSelectedUser?.type,
      })
    );
  };

  const handleTyping = (message) => {
    const { userId, currentUser, userName, isTyping } = message.data;

    if (stableSelectedUser?.type === "user" && userId === stableUser?.id) {
      // Private Chat: Only one user can be typing
      setIsTyping(isTyping);
    } else if (stableSelectedUser?.type === "group" && userId !== currentUser) {
      // Group Chat: Maintain an array of typing users
      setTypingUsers((prev) => {
        if (isTyping) {
          return prev.includes(userName) ? prev : [...prev, userName]; // Add user if not already in the list
        } else {
          return prev.filter((name) => name !== userName); // Remove user when they stop typing
        }
      });
    }
  };

  useEffect(() => {
    if (!chatChannel) return;

    const handleDeleteMessage = (message) => {
      dispatch(
        updateDeleteMessage({
          msgId: message.data.msgId,
          isSender: message.data.isSender,
        })
      );
    };

    chatChannel.subscribe("message-deleted", handleDeleteMessage);
    chatChannel.subscribe("typing", handleTyping);

    return () => {
      chatChannel.unsubscribe("message-deleted", handleDeleteMessage);
      chatChannel.unsubscribe("typing", handleTyping);
    };
  }, [dispatch, chatChannel]);

  

  return {
    recentChats,
    messages,
    chatLoading,
    error,
    typingUsers,
    isTyping,
    setIsTyping,
    loadMessages,
    handleMessageSend,
    handleMsgDelete,
    sendTypingEvent,
  };
};
