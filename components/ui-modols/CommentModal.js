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
import { Trash2, SendHorizontal, MessageCircle } from "lucide-react";
import Image from "next/image";
import useComments from "@/hooks/useComments";

const CommentModal = ({
  postId,
  userId,
  currectPost,
  showModal,
  setShowModal,
}) => {
  const {
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
  } = useComments(postId, userId);

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="p-0 w-full max-w-md rounded-lg shadow-lg">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-base font-semibold ">
            Comments
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {currectPost?.comments?.length > 0 ? (
            currectPost.comments.map((comment) => (
              <div key={comment._id} className="p-3 border-b rounded-lg">
                <div className="flex items-start space-x-3">
                  <Image
                    src={comment.user.profilePicture || "/default-avatar.png"}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div className="w-full">
                    <p className="text-sm font-semibold">{comment.user.name}</p>
                    <p>{comment.text}</p>
                    <div className="mt-1 flex space-x-2">
                      <Button
                        variant="ghost"
                        className="text-xs flex items-center"
                        onClick={() =>
                          setActiveReply(
                            activeReply === comment._id ? null : comment._id
                          )
                        }
                      >
                        <MessageCircle className="w-3 h-3 mr-1" /> Reply
                      </Button>
                      {userId?.toString() ===
                        comment?.user?._id?.toString() && (
                        <Button
                          variant="ghost"
                          className="text-xs text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    {activeReply === comment._id && (
                      <div className="mt-2 flex items-center space-x-2">
                        <Textarea
                          placeholder="Write a reply..."
                          className="w-full p-1 border rounded-md text-xs"
                          value={replyText[comment._id] || ""}
                          onChange={(e) =>
                            handleReplyChange(comment._id, e.target.value)
                          }
                        />
                        <Button
                          className="p-1 text-xs bg-blue-500"
                          onClick={() => handleAddReply(comment._id)}
                        >
                          <SendHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {comment.replies?.map((reply) => (
                  <div
                    key={reply._id}
                    className="pl-12 mt-2 flex items-start space-x-3"
                  >
                    <Image
                      src={reply?.user?.profilePicture || "/default-avatar.png"}
                      alt="User Avatar"
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                    <div className="w-full">
                      <p className="text-sm font-semibold">{reply?.user?.name}</p>
                      <p className="text-gray-600">{reply.text}</p>
                    </div>
                    {userId?.toString() === reply?.user?._id?.toString() && (
                      <Button
                        variant="ghost"
                        className="text-xs text-red-500 hover:text-red-700"
                        onClick={() =>
                          handleDeleteReply(comment._id, reply._id)
                        }
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No comments yet.</p>
          )}
        </div>

        <div className="p-3 border-t flex items-center space-x-2">
          <Textarea
            placeholder="Write a comment..."
            className="w-full p-2 border rounded-md"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button className="p-2 bg-blue-600" onClick={handleAddComment}>
            <SendHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;
