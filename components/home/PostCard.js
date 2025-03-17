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
import { useUser } from "@/hooks/useUser";
import { getAblyClient } from "@/lib/ablyClient";
import renderMedia from "@/utils/renderMedia";
import { deletePost, likeOrUnlikePost, updateDeletePost, updateLikeIntoPost } from "@/redux/slices/postSlice";
import { useDispatch } from "react-redux";
import CommentModal from "../ui-modols/CommentModal";

export default function PostCard({ post }) {
  const { user } = useUser();
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState(false);


  const ablyClient = getAblyClient(user?.id); // Get Ably client instance
  const channel = ablyClient?.channels.get("post-actions"); // Get the channel

  const fileTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  const handleLike = async () => {
    if (!channel) return;

    // Publish like event to Ably
    channel.publish("like-post", { postId: post._id, userId: user.id });

    // Update Redux state
    await dispatch(
      likeOrUnlikePost({ postId: post._id, userId: user?.id })
    ).unwrap();
  };

  const handleDelete = async () => {
    if (!channel) return;

    const res = await dispatch(deletePost(post._id)).unwrap();

    if (res.status === 200) {
      // Publish delete event to Ably
      channel.publish("delete-post", { postId: post._id });
    }
  };

  useEffect(() => {
    if (!channel) return;

    // Listen for like updates
    channel.subscribe("like-post", (post) => {
        dispatch(updateLikeIntoPost({ postId: post.data.postId, userId: post.data.userId }));
    });

    // Listen for post deletions
    channel.subscribe("delete-post", (post) => {
      if (post.data?.postId) {
        dispatch(updateDeletePost({ postId: post.data.postId })); // Dispatch action to remove post
      }
    });

    // Cleanup function
    return () => {
      channel.unsubscribe("like-post");
      channel.unsubscribe("delete-post");
    };
  }, [dispatch, channel, post._id]);

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
              <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {renderMedia(fileTypes, post)}

        <div className="flex items-center space-x-4 mt-4">
          <Button onClick={handleLike} variant="ghost" size="sm">
            <Heart
              className={`w-5 h-5 ${
                post.likes.includes(user?.id) ? "text-red-600" : ""
              }`}
            />
            <span>{post?.likes?.length}</span>
          </Button>
          <Button  onClick={() => setShowComments(true)} variant="ghost" size="sm">
            <MessageCircle className="w-5 h-5" />
            <span>{post?.comments?.length}</span>
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </Button>
        </div>
      </div>
      {showComments && <CommentModal userId={user?.id} currectPost={post} postId={post._id} showModal={showComments} setShowModal={setShowComments} />}
    </Card>
  );
}
