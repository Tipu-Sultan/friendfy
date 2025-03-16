import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost, fetchPosts, setPostFormData } from "@/redux/slices/postSlice";
import { useUser } from "./useUser";
import { getAblyClient } from "@/lib/ablyClient";
import { createNewPost } from "@/actions/serverActions";

const usePosts = () => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { posts, isLoading, postFormData } = useSelector((state) => state.posts);
  const { content, contentType } = postFormData;
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Ably client and channel initialization
  const client = getAblyClient(user?.id || null);
  const channelName = "new-posts-channel";
  const postChannel = client?.channels?.get(channelName);

  // Handle content change
  const handleContentChange = (e) => {
    dispatch(setPostFormData({ content: e.target.value }));
  };

  // Handle media file change
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedMedia(file);
      setMediaPreview(URL.createObjectURL(file));

      dispatch(
        setPostFormData({
          file: file,
          contentType: file.type,
        })
      );
    }
  };

  // Remove selected media
  const handleRemoveMedia = () => {
    setSelectedMedia(null);
    setMediaPreview(null);
    dispatch(setPostFormData({ file: null, contentType: "" }));
  };

  // Submit the post
  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!content && !selectedMedia) {
      alert("Please provide content or select a media file.");
      return;
    }

    try {
      setUploadProgress(10);
      const formData = new FormData();
      formData.append("content", content);
      if (selectedMedia) {
        formData.append("file", selectedMedia);
        formData.append("contentType", contentType);
      }
      formData.append("userId", user?.id);

      // Call the server action instead of Redux action
      const res = await createNewPost(formData);

      if (res?.success) {
        const newPost = res.post;

        // Broadcast new post via Ably
        postChannel?.publish("new-post", newPost);

        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 500);
      }

      // Reset form
      setSelectedMedia(null);
      setMediaPreview(null);
      dispatch(setPostFormData({ content: "", file: null, contentType: "" }));
    } catch (error) {
      console.error("Error submitting post:", error.message);
      alert("Failed to create post. Please try again.");
      setUploadProgress(0);
    }
  };

  // Subscribe to Ably channel for real-time updates
  useEffect(() => {
    if (!postChannel) return;

    const handleReceivePost = (message) => {
      const newPost = message.data;
      dispatch(addNewPost(newPost)); // Add new post to Redux store
    };

    postChannel.subscribe("new-post", handleReceivePost);

    return () => {
      postChannel.unsubscribe("new-post", handleReceivePost);
    };
  }, [postChannel, dispatch]);

  return {
    posts,
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
  };
};

export default usePosts;
