"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, MoreVertical } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import renderMedia from "@/utils/renderMedia";
import {
  deletePost,
  likeOrUnlikePost,
  setPostFormData,
  updateDeletePost,
  updateLikeIntoPost,
} from "@/redux/slices/postSlice";
import { useDispatch } from "react-redux";
import CommentModal from "../ui-modols/CommentModal";
import ReportModal from "../ui-modols/ReportModal";

export default function PostCard({ setEditingPost, post, user, ablyClient }) {
  const dispatch = useDispatch();
  const postChannel = ablyClient?.channels.get("post-actions"); // Get the channel
  const [showComments, setShowComments] = useState(false);
  const [showReportModal, setReportModal] = useState(false);

  const fileTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  const handleLikePost = async () => {
    if (!postChannel) return;

    // Publish like event to Ably
    postChannel.publish("like-post", { postId: post._id, userId: user.id });

    console.log("like-post", { postId: post._id, userId: user.id });
    // Dispatch like/unlike action
    await dispatch(
      likeOrUnlikePost({ postId: post._id, userId: user.id })
    ).unwrap();
  };

  const handleDeletePost = async () => {
    if (!postChannel) return;

    const res = await dispatch(deletePost(post._id)).unwrap();

    if (res.status === 200) {
      // Publish delete event to Ably
      postChannel.publish("delete-post", { postId: post._id });
    }
  };

  useEffect(() => {
    if (!postChannel) return;

    // Listen for like updates
    postChannel.subscribe("like-post", (message) => {
      console.log("like-post", message.data);

      dispatch(updateLikeIntoPost(message.data));
    });

    // Listen for post deletions
    postChannel.subscribe("delete-post", (postData) => {
      if (postData.data?.postId) {
        dispatch(updateDeletePost({ postId: postData.data.postId })); // Dispatch action to remove post
      }
    });

    // Cleanup function
    return () => {
      postChannel.unsubscribe("like-post");
      postChannel.unsubscribe("delete-post");
    };
  }, [dispatch, postChannel]);

  return (
    <Card className="mb-6 max-w-lg mx-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <Image
                src={post?.user?.profilePicture || "/default-avatar.png"}
                alt={post?.user?.username}
                className="w-10 h-10 rounded-full"
                width={40}
                height={40}
              />
            </Avatar>
            <div>
              <h3 className="font-semibold">{post?.user?.username}</h3>
              <p className="text-xs text-muted-foreground">
                {new Date(post?.createdAt).toLocaleString()}
                <span>{post.isEdited && " Edited"}</span>
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setReportModal(true)}>
                Report
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Only show Delete & Edit options for the post owner */}
              {post?.user?._id === user?.id && (
                <>
                  <DropdownMenuItem
                    onClick={() => setEditingPost(post)}
                    className="text-blue-600"
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDeletePost}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {renderMedia(fileTypes, post)}
        {post.isEdited && (
          <span className="text-xs">
            Edited: {new Date(post?.updatedAt).toLocaleString()}
          </span>
        )}

        <div className="flex items-center space-x-4 mt-4">
          <Button onClick={handleLikePost} variant="ghost" size="sm">
            <Heart
              className={`w-5 h-5 ${
                post.likes.includes(user?.id) ? "text-red-600" : "text-gray-400"
              }`}
            />
            <span>{post?.likes?.length}</span>
          </Button>

          {/* Debug UI updates */}
          <p>Likes: {JSON.stringify(post.likes)}</p>

          <Button
            onClick={() => setShowComments(true)}
            variant="ghost"
            size="sm"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post?.comments?.length}</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </Button>
        </div>
      </div>
      {showComments && (
        <CommentModal
          commentChannel={postChannel}
          currentUser={user}
          userId={user?.id}
          currectPost={post}
          postId={post._id}
          showModal={showComments}
          setShowModal={setShowComments}
        />
      )}

      {showReportModal && (
        <ReportModal
          commentChannel={postChannel}
          showModal={showReportModal}
          setShowModal={setReportModal}
          postId={post._id}
        />
      )}
    </Card>
  );
}
