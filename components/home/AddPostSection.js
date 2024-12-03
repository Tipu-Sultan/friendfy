"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Image as LuImage, Smile, Video, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, setPostFormData } from "@/redux/slices/postSlice";
import useAuthData from "@/hooks/useAuthData";
import Image  from 'next/image';


export default function AddPostSection() {
  const dispatch = useDispatch();
  const { user } = useAuthData();
  const { content, file, contentType } = useSelector(
    (state) => state.posts.postFormData
  );
  const { isLoading } = useSelector((state) => state.posts);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  // Handle content change
  const handleContentChange = (e) => {
    dispatch(setPostFormData({ content: e.target.value }));
  };

  // Handle media file change
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type; 
      setSelectedMedia(file);
      setMediaPreview(URL.createObjectURL(file)); 
      dispatch(
        setPostFormData({
          file: {
            name: file.name,
            type: fileType,
            size: file.size,
          },
          contentType: fileType,
        })
      );
    }
  };

  // Remove selected media
  const handleRemoveMedia = () => {
    setSelectedMedia(null);
    setMediaPreview(null);
    dispatch(setPostFormData({ file: null, contentType: null }));
  };

  // Submit the post
  const handlePostSubmit = async (e) => {
    e.preventDefault();
  
    if (!content && !selectedMedia) {
      alert("Please provide content or select a media file.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (selectedMedia) {
        formData.append("file", selectedMedia); // Attach media file
        formData.append("contentType", contentType); // Attach content type
      }
      formData.append("userId", user?._id);
  
      await dispatch(createPost(formData)).unwrap(); 

      setSelectedMedia(null);
      dispatch(setPostFormData({ content: "", file: null, contentType: "" }));
    } catch (error) {
      console.error("Error submitting post:", error.message);
      alert("Failed to create post. Please try again.");
    }
  };
  

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
                {content?.length +'/400'}
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
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
