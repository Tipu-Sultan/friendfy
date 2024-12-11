import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost, createPost, fetchPosts, setPostFormData } from '@/redux/slices/postSlice';
import { useSocket } from "@/components/socketContext";
import useAuthData from "./useAuthData";

const usePosts = () => {
  const dispatch = useDispatch();
  const { user } = useAuthData();
  const privateSocket = useSocket();
  const { posts, isLoading, postFormData } = useSelector((state) => state.posts);
  const { content, contentType } = postFormData;
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress

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
      setUploadProgress(10); // Start upload progress
      const formData = new FormData();
      formData.append("content", content);
      if (selectedMedia) {
        formData.append("file", selectedMedia); // Attach media file
        formData.append("contentType", contentType); // Attach content type
      }
      formData.append("userId", user?._id);

      const res = await dispatch(createPost(formData)).unwrap();

      if (res.status === 201) {
        const newPost = res.post;
        privateSocket?.emit("new-post", { userId: user._id, post: newPost }); // Broadcast
        setUploadProgress(100); // Complete upload progress
        setTimeout(() => setUploadProgress(0), 500); // Reset progress after a short delay
      }

      setSelectedMedia(null);
      setMediaPreview(null);
      dispatch(setPostFormData({ content: "", file: null, contentType: "" }));
    } catch (error) {
      console.error("Error submitting post:", error.message);
      alert("Failed to create post. Please try again.");
      setUploadProgress(0); // Reset on failure
    }
  };

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts.length]);

  useEffect(() => {
    privateSocket?.on('receive-post', (newPost) => {
      dispatch(addNewPost(newPost)); // Add the new post to the Redux store
    });

    return () => {
      privateSocket?.off('receive-post'); // Cleanup listener on unmount
    };
  }, [privateSocket, dispatch]);

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
