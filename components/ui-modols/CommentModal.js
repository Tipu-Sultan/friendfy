import React, { useState } from "react";
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
import { addComment, deleteComment } from "@/redux/slices/postSlice";
import Image from "next/image";

const CommentModal = ({ postId, userId, currectPost, showModal, setShowModal }) => {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState({});

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    dispatch(addComment({ postId, userId, text: commentText }));
    setCommentText("");
  };

  const handleReplyChange = (commentId, text) => {
    setReplyText((prev) => ({ ...prev, [commentId]: text }));
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment({ postId, commentId }));
  };


  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="p-0 w-full max-w-md rounded-lg shadow-lg">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-base font-semibold text-gray-800">Comments</DialogTitle>
        </DialogHeader>

        {/* Comments List */}
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {currectPost?.comments?.length > 0 ? (
            currectPost.comments.map((comment) => (
              <div key={comment._id} className="flex items-start space-x-3 p-2 border-b">
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
                      <strong className="font-semibold">{comment.user.name}</strong>{" "}
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

                  {/* Reply Section */}
                  <div className="mt-2 flex items-center space-x-2">
                    <Textarea
                      placeholder="Reply..."
                      className="w-full p-1 border rounded-md text-xs"
                      value={replyText[comment._id] || ""}
                      onChange={(e) => handleReplyChange(comment._id, e.target.value)}
                    />
                    <Button
                      className="p-1 text-xs bg-blue-500 text-white rounded-md"
                      onClick={() => console.log("Replying to:", comment._id)}
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
          <Button className="p-2 bg-blue-600 text-white rounded-md" onClick={handleAddComment}>
            <SendHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;
