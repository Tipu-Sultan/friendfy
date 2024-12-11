import { useDispatch, useSelector } from "react-redux";
import crypto from 'crypto';
import {
  fetchMessages,
  sendMessages,
  setContent,
} from "../redux/slices/chatSlice";
import { useEffect, useState, useCallback, useMemo } from "react";
import useAuthData from "./useAuthData";

export const useChat = (user, username, privateSocket) => {
  const dispatch = useDispatch();
  const { recentChats, messages, selectedUser, chatLoading, error, content } = useSelector((state) => state.chat);
  const [contentType, setContentType] = useState('');

  const stableSelectedUser = useMemo(() => selectedUser, [selectedUser]);
  const stableUser = useMemo(() => user, [user]);

  const handleMessageSend = (sender, receiver, type) => {
    const tempId = crypto.randomBytes(6).toString("hex").toUpperCase(); // Generate a temporary unique ID

    const senderType = type === 'group' ? {
      _id: user._id,
      username: user?.username,
      profilePicture: user?.profilePicture,
    } : sender;

    const reduxPayload = {
      type,
      tempId,
      sender: senderType,
      receiver,
      content,
      contentType: contentType || 'text/plain',
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
      contentType: contentType || 'text/plain',
      media: null,
      status: "pending",
    };

    // Optimistically add the message to Redux
    dispatch({
      type: "chat/addMessage",
      payload: { message: reduxPayload },
    });

    if (type === 'user' && privateSocket && privateSocket.connected) {
      privateSocket.emit("privateMessage", reduxPayload);
    }

    if (type === 'group' && privateSocket && privateSocket.connected) {
      privateSocket?.emit("groupMessage", reduxPayload);
    }

    // Send the message to the server (Assuming sendMessages handles the API call)
    dispatch(sendMessages(messagePayload));

    // Clear the input field
    dispatch(setContent(""));
  };

  // Memoize the loadMessages function
  const loadMessages = useCallback(
    (sender, receiver, type) => {
      dispatch(fetchMessages({ sender, receiver, page: 1, type }));
    },
    [dispatch]
  );

  // Automatically fetch messages for selected user
  useEffect(() => {
    if (stableSelectedUser?.id && stableSelectedUser?.type) {
      loadMessages(stableUser._id, stableSelectedUser.id, stableSelectedUser.type);
    }
  }, [loadMessages, stableSelectedUser]);

  // Listen for message acknowledgments and delivery
  useEffect(() => {
    if (privateSocket) {
      privateSocket?.on("messageSent", (data) => {
        dispatch({
          type: "chat/updateMessageStatus",
          payload: { tempId: data.tempId, status: data.status },
        });
      });

      privateSocket?.on("messageReceived", (message) => {
        if (selectedUser && selectedUser.id === message?.sender) {
          dispatch({
            type: "chat/addMessage",
            payload: { message },
          });
        }
      });

      return () => {
        privateSocket?.off("messageSent");
        privateSocket?.off("messageReceived");
      };
    }
  }, [dispatch, privateSocket, selectedUser]);

  useEffect(() => {
    if (privateSocket) {
      privateSocket?.on("groupMessageSent", (data) => {
        dispatch({
          type: "chat/updateMessageStatus",
          payload: { tempId: data.tempId, status: data.status },
        });
      });

      privateSocket?.on("groupMessageReceived", (message) => {
        dispatch({
          type: "chat/addMessage",
          payload: { message },
        });
      });

      return () => {
        privateSocket?.off("groupMessageSent");
        privateSocket?.off("groupMessageReceived");
      };
    }
  }, [privateSocket, dispatch]);

  return {
    recentChats,
    messages,
    chatLoading,
    error,
    loadMessages,
    handleMessageSend,
  };
};
