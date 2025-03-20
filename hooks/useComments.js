import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addComment,
  addReply,
  deleteComment,
  deleteReply,
  updatePostAfterDeleteComment,
  updatePostAfterDeleteReply,
  updatePostComment,
  updatePostReply,
} from "@/redux/slices/postSlice";
import { getAblyClient } from "@/lib/ablyClient";

const useComments = (postId, userId) => {
  const dispatch = useDispatch();
    const [commentText, setCommentText] = useState("");
    const [replyText, setReplyText] = useState({}); // Store replies per commentId
    const [activeReply, setActiveReply] = useState(null);
    const ablyClient = getAblyClient(userId);
    const commentChannel = ablyClient?.channels?.get("post-actions");
  
    const handleReplyChange = (commentId, text) => {
      setReplyText((prev) => ({
        ...prev,
        [commentId]: text, // Update specific comment reply
      }));
    };
  
    const handleAddReply = async (commentId) => {
      if (!replyText[commentId]?.trim()) return; // Prevent empty replies
  
      try {
        const updatedReply = await dispatch(
          addReply({ postId, commentId, userId, text: replyText[commentId] })
        ).unwrap();
  
        // Publish update event with postId, commentId, and updated reply
        commentChannel.publish("update-reply", {
          postId,
          commentId,
          reply: updatedReply,
        });
  
        setReplyText((prev) => ({ ...prev, [commentId]: "" })); // Clear input after submission
      } catch (error) {
        console.error("Failed to add reply:", error);
      }
    };
  
    const handleDeleteComment = async (commentId) => {
      try {
        // Dispatch action and wait for the response
        await dispatch(deleteComment({ postId, commentId })).unwrap();
  
        // Publish delete event with postId and commentId
        commentChannel.publish("delete-comment", { postId, commentId });
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    };
  
    const handleDeleteReply= async (commentId,replyId) => {
      try {
        // Dispatch action and wait for the response
        await dispatch(deleteReply({ postId, commentId,replyId })).unwrap();
  
        // Publish delete event with postId and commentId
        commentChannel.publish("delete-reply", { postId, commentId,replyId });
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    };
  
    useEffect(() => {
      if (!commentChannel) return;
  
      commentChannel.subscribe("update-comment", (message) => {
  
        if (!message.data?.postId || !message.data?.comment) return;
  
        dispatch(
          updatePostComment({
            postId: message.data.postId,
            comment: message.data.comment, // Use full comment object
          })
        );
      });
  
      commentChannel.subscribe("delete-comment", (message) => {
  
        if (!message.data?.postId || !message.data?.commentId) return;
  
        dispatch(
          updatePostAfterDeleteComment({
            postId: message.data.postId,
            commentId: message.data.commentId, // Use only necessary details
          })
        );
      });
  
      return () => {
        commentChannel.unsubscribe("update-comment");
        commentChannel.unsubscribe("delete-comment");
      };
    }, [commentChannel, dispatch]);
  
    useEffect(() => {
      if (!commentChannel) return;
  
      // Listening for new replies
      commentChannel.subscribe("update-reply", (message) => {
  
        if (
          !message.data?.postId ||
          !message.data?.commentId ||
          !message.data?.reply
        )
          return;
  
        dispatch(
          updatePostReply({
            postId: message.data.postId,
            commentId: message.data.commentId,
            reply: message.data.reply.reply, // Full reply object
          })
        );
      });
  
      // Listening for reply deletions
      commentChannel.subscribe("delete-reply", (message) => {
  
        if (
          !message.data?.postId ||
          !message.data?.commentId ||
          !message.data?.replyId
        )
          return;
  
        dispatch(
          updatePostAfterDeleteReply({
            postId: message.data.postId,
            commentId: message.data.commentId,
            replyId: message.data.replyId, // Only necessary details
          })
        );
      });
  
      return () => {
        commentChannel.unsubscribe("update-reply");
        commentChannel.unsubscribe("delete-reply");
      };
    }, [commentChannel, dispatch]);
  
    const handleAddComment = async () => {
      if (!commentText.trim()) return;
  
      const commentData = {
        postId,
        userId,
        text: commentText,
      };
  
      try {
        // Dispatch action and wait for the response
        const res = await dispatch(addComment(commentData)).unwrap();
  
        if (res?.comment) {
          // Ensure postId is included in the broadcasted message
          commentChannel.publish("update-comment", {
            postId: res.postId,
            comment: res.comment,
          });
        }
  
        setCommentText(""); // Clear input after successful comment
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    };

  return {
    commentText,
    setCommentText,
    replyText,
    activeReply,
    setActiveReply,
    handleReplyChange,
    handleAddComment,
    handleAddReply,
    handleDeleteComment,
    handleDeleteReply,
  };
};

export default useComments;
