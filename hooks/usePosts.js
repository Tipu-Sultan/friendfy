import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost, createPost, setPostFormData } from "@/redux/slices/postSlice";
import { useUser } from "./useUser";
import { getAblyClient } from "@/lib/ablyClient";

const usePosts = () => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const ablyClient = getAblyClient(user?.id); // Get Ably client
  const postChannel = ablyClient?.channels.get("add-post-actions"); // Get channel

  const { posts, isLoading, postFormData } = useSelector((state) => state.posts);
  const { content, contentType } = postFormData;
  
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle text content change
  const handleContentChange = (e) => {
    dispatch(setPostFormData({ content: e.target.value }));
  };

  // Handle media file change
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedMedia(file);
      setMediaPreview(URL.createObjectURL(file));
      dispatch(setPostFormData({
        file: { name: file.name, type: file.type, size: file.size },
        contentType: file.type,
      }));
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
      setUploadProgress(10); // Start progress
      const formData = new FormData();
      formData.append("content", content);
      if (selectedMedia) {
        formData.append("file", selectedMedia);
        formData.append("contentType", contentType);
      }
      formData.append("userId", user?.id);

      const res = await dispatch(createPost(formData)).unwrap();

      if (res.status === 201) {
        const newPost = res.post;
        postChannel?.publish("new-post", { userId: user.id, post: newPost }); // Broadcast

        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 500);

        dispatch(setPostFormData({ content: "", file: null, contentType: "" })); // Reset form
        setSelectedMedia(null);
        setMediaPreview(null);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Failed to create post. Please try again.");
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    if (!postChannel) return;

    // Subscribe to new posts
    const subscribeToPosts = async () => {
      await postChannel.subscribe("new-post", (message) => {
        const newPost = message.data.post;
        dispatch(addNewPost(newPost)); // Add to Redux store
      });
    };

    subscribeToPosts();

    return () => {
      postChannel.unsubscribe("new-post"); // Cleanup on unmount
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
