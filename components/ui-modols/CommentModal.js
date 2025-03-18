import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, SendHorizontal } from "lucide-react";
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
import Image from "next/image";

const CommentModal = ({
  postId,
  commentChannel,
  currentUser,
  userId,
  currectPost,
  showModal,
  setShowModal,
}) => {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState({}); // Store replies per commentId

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
      console.log("Received comment update:", message.data); // Debugging

      if (!message.data?.postId || !message.data?.comment) return;

      dispatch(
        updatePostComment({
          postId: message.data.postId,
          comment: message.data.comment, // Use full comment object
        })
      );
    });

    commentChannel.subscribe("delete-comment", (message) => {
      console.log("Received delete update:", message.data); // Debugging

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
      console.log("Received reply update:", message.data); // Debugging

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
      console.log("Received delete reply update:", message.data); // Debugging

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

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="p-0 w-full max-w-md rounded-lg shadow-lg">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-base font-semibold text-gray-800">
            Comments
          </DialogTitle>
        </DialogHeader>

        {/* Comments List */}
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {currectPost?.comments?.length > 0 ? (
            currectPost.comments.map((comment) => (
              <div
                key={comment._id}
                className="flex items-start space-x-3 p-2 border-b"
              >
                {/* User Profile Picture */}
                <Image
                  src={comment.user.profilePicture || "/default-avatar.png"}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />

                <div className="w-full">
                  {/* Username & Comment */}
                  <div className="flex justify-between items-center">
                    <p className="text-sm">
                      <strong className="font-semibold">
                        {comment.user.name}
                      </strong>{" "}
                      <span className="text-gray-600">{comment.text}</span>
                    </p>
                    {userId?.toString() === comment?.user?._id?.toString() && (
                      <button
                        className="text-gray-500 hover:text-red-600"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="mt-2 space-y-2">
                      {comment.replies?.map((reply) => (
                        <div key={reply._id} className="flex items-start space-x-3 pl-8">
                          <Image
                            src={reply.user.profilePicture || "/default-avatar.png"}
                            alt="User Avatar"
                            width={28}
                            height={28}
                            className="rounded-full"
                          />
                          <div className="w-full">
                            <p className="text-sm font-semibold">{reply.user.name}</p>
                            <p className="text-gray-600">{reply.text}</p>
                          </div>
                          {userId?.toString() === reply?.user?._id?.toString() && (
                            <button
                              className="text-gray-500 hover:text-red-600"
                              onClick={() => handleDeleteReply(comment._id, reply._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                  {/* Reply Section */}
                  <div className="mt-2 flex items-center space-x-2">
                    <Textarea
                      placeholder="Reply..."
                      className="w-full p-1 border rounded-md text-xs"
                      value={replyText[comment._id] || ""}
                      onChange={(e) =>
                        handleReplyChange(comment._id, e.target.value)
                      }
                    />
                    <Button
                      className="p-1 text-xs bg-blue-500 rounded-md"
                      onClick={() => handleAddReply(comment._id)}
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No comments yet.</p>
          )}
        </div>

        {/* Comment Input */}
        <div className="p-3 border-t flex items-center space-x-2">
          <Textarea
            placeholder="Write a comment..."
            className="w-full p-2 border rounded-md"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button
            className="p-2 bg-blue-600  rounded-md"
            onClick={handleAddComment}
          >
            <SendHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;
