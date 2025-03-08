import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost, createPost, fetchPosts, setPostFormData } from "@/redux/slices/postSlice";
import { useUser } from "./useUser";
import { getAblyClient } from "@/lib/ablyClient";

const usePosts = () => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { reduxPost, isLoading, postFormData } = useSelector((state) => state.posts);
  const { content, contentType } = postFormData;
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress

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
      setUploadProgress(10); // Start upload progress
      const formData = new FormData();
      formData.append("content", content);
      if (selectedMedia) {
        formData.append("file", selectedMedia);
        formData.append("contentType", contentType);
      }
      formData.append("userId", user?.id);

      // Send the post creation request
      const res = await dispatch(createPost(formData)).unwrap();

      if (res.status === 201) {
        const newPost = res.post;

        // Broadcast new post via Ably
        postChannel?.publish("new-post", newPost);

        setUploadProgress(100); // Complete upload progress
        setTimeout(() => setUploadProgress(0), 500); // Reset progress after short delay
      }

      // Reset form
      setSelectedMedia(null);
      setMediaPreview(null);
      dispatch(setPostFormData({ content: "", file: null, contentType: "" }));
    } catch (error) {
      console.error("Error submitting post:", error.message);
      alert("Failed to create post. Please try again.");
      setUploadProgress(0); // Reset on failure
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
