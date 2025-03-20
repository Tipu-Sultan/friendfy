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
import renderMedia from "@/utils/renderMedia";
import CommentModal from "../ui-modols/CommentModal";
import ReportModal from "../ui-modols/ReportModal";
import { ConfirmAlertDialog } from "../ui-modols/ConfirmAlertDialog";

export default function PostCard({
  user,
  post,
  setEditingPost,
  fileTypes,
  showComments,
  showReportModal,
  setShowComments,
  setReportModal,
  handleDeletePost,
  handleLikePost,
}) {
  const isPostOwner = post?.user?._id === user?.id;

  return (
    <Card className="mb-6 max-w-lg mx-auto">
      <div className="p-4">
        {/* User Info & Actions */}
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
                {post.isEdited && " • Edited"}
              </p>
            </div>
          </div>

          {/* Dropdown Menu for Actions */}
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
              {isPostOwner && (
                <>
                  <DropdownMenuItem
                    onClick={() => setEditingPost(post)}
                    className="text-blue-600"
                  >
                    Edit
                  </DropdownMenuItem>

                  <ConfirmAlertDialog
                    triggerText="Delete"
                    onConfirm={() => handleDeletePost(post?._id)}
                  />
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Post Content */}
        {renderMedia(fileTypes, post)}

        {/* Edited Timestamp */}
        {post.isEdited && (
          <span className="text-xs">
            Edited: {new Date(post?.updatedAt).toLocaleString()}
          </span>
        )}

        {/* Post Actions */}
        <div className="flex items-center space-x-4 mt-4">
          <Button
            onClick={() => handleLikePost(post?._id)}
            variant="ghost"
            size="sm"
          >
            <Heart
              className={`w-5 h-5 ${
                post.likes.includes(user?.id) ? "text-red-600" : ""
              }`}
            />
            <span>{post?.likes?.length}</span>
          </Button>
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

      {/* Comment Modal */}
      {showComments && (
        <CommentModal
          currentUser={user}
          userId={user?.id}
          currectPost={post}
          postId={post._id}
          showModal={showComments}
          setShowModal={setShowComments}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          showModal={showReportModal}
          setShowModal={setReportModal}
          postId={post._id}
        />
      )}
    </Card>
  );
}
