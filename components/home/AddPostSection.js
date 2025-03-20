"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Image as LuImage, Smile, Video, XCircle } from "lucide-react";
import Image from 'next/image';
import usePosts from "@/hooks/usePosts";
import { Progress } from "../ui/progress";


export default function AddPostSection({editingPost, setEditingPost}) {
  const {
    isLoading,
    content,
    contentType,
    mediaPreview,
    selectedMedia,
    uploadProgress,
    handleContentChange,
    handleRemoveMedia,
    handleMediaChange,
    handlePostSubmit,
    isEditing,
  } = usePosts(editingPost, setEditingPost);


  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handlePostSubmit}>
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={handleContentChange}
            className="mb-4 min-h-[100px] resize-none"
          />
          {/* Media Preview */}
          {mediaPreview && (
            <div className="relative mb-4">
              {contentType.startsWith("image") && (
                <Image
                  src={mediaPreview}
                  alt="Preview"
                  className="w-full max-h-60 object-contain"
                  width={100}
                  height={60}
                />
              )}
              {contentType.startsWith("video") && (
                <video
                  src={mediaPreview}
                  controls
                  className="w-full max-h-60 object-contain"
                />
              )}
              <button
                type="button"
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                onClick={handleRemoveMedia}
              >
                <XCircle className="h-6 w-6 text-red-500" />
              </button>
            </div>
          )}
          {uploadProgress > 0 && (
            <div className="my-2">
              <Progress value={uploadProgress} />
            </div>
          )}

          <div className="flex items-center justify-between space-x-4">
            <div className="flex space-x-4">
              {/* Image Upload Button */}
              <div className="relative group">
                <label htmlFor="image-input" className="cursor-pointer">
                  <LuImage className="h-6 w-6 text-blue-500 transition-all duration-200 hover:scale-110" />
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-200">Image</span>
                </label>
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleMediaChange}
                  className="hidden"
                  aria-label="Upload Image"
                />
                {content?.length + '/400'}
              </div>

              {/* Video Upload Button */}
              <div className="relative group">
                <label htmlFor="video-input" className="cursor-pointer">
                  <Video className="h-6 w-6 text-green-500 transition-all duration-200 hover:scale-110" />
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-200">Video</span>
                </label>
                <input
                  id="video-input"
                  type="file"
                  accept="video/*"
                  onChange={handleMediaChange}
                  className="hidden"
                  aria-label="Upload Video"
                />
              </div>

              {/* Smile Emoji Button */}
              <div className="relative group">
                <button type="button" aria-label="Add Emoji">
                  <Smile className="h-6 w-6 text-yellow-500 transition-all duration-200 hover:scale-110" />
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-200">Emoji</span>
                </button>
              </div>
            </div>
            {/* Post Button */}
            <Button disabled={!(selectedMedia || content) || isLoading} type="submit" className="px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 rounded-lg shadow-lg">
            {isLoading === "updatePost" ? "Updating..." : isEditing ? "Update Post" : "Post"}

            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
