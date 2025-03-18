import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost, setPostFormData, addNewPost, updateExistingPost } from "@/redux/slices/postSlice";
import { useUser } from "./useUser";
import { getAblyClient } from "@/lib/ablyClient";

const usePosts = (editingPost = null,setEditingPost) => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const ablyClient = getAblyClient(user?.id);
  const postChannel = ablyClient?.channels.get("add-post-actions");

  const { posts, isLoading, postFormData } = useSelector((state) => state.posts);
  const { content, contentType } = postFormData;

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [postId, setPostId] = useState(null);


  useEffect(() => {
    if (editingPost) {
      setIsEditing(true);
      setPostId(editingPost._id);
      dispatch(setPostFormData({ 
        content: editingPost.content || "", 
        contentType: editingPost.contentType || "",
      }));
      setMediaPreview(editingPost.mediaUrl || null);
    } else {
      setIsEditing(false);
      setPostId(null);
      dispatch(setPostFormData({ content: "", contentType: "" }));
      setMediaPreview(null);
    }
  }, [editingPost, dispatch]);
  

  const handleContentChange = (e) => {
    dispatch(setPostFormData({ content: e.target.value }));
  };

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

  const handleRemoveMedia = () => {
    setSelectedMedia(null);
    setMediaPreview(null);
    dispatch(setPostFormData({ file: null, contentType: null }));
  };

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
      formData.append("postId", editingPost?._id);

      let response;
      if (isEditing && postId) {
        response = await dispatch(updatePost({postId,updatedData: formData })).unwrap();
      } else {
        response = await dispatch(createPost(formData)).unwrap();
      }

      if (response.status === 201 || response.status === 200) {
        isEditing && postId?
        postChannel?.publish("update-post", { userId: user.id, updatedFields: response.updatedFields, postId }):
        postChannel?.publish("new-post",{ userId: user.id, post: response.post })


        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 500);

        dispatch(setPostFormData({ content: "", file: null, contentType: "" }));
        setSelectedMedia(null);
        setMediaPreview(null);
        setIsEditing(false);
        setPostId(null);
        setEditingPost(null)
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Failed to save post. Please try again.");
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

     // Subscribe to new posts
     const updatePost = async () => {
      await postChannel.subscribe("update-post", (message) => {
        const { updatedFields, postId } = message.data;
        dispatch(updateExistingPost({ postId, updatedFields })); // Dispatch update
      });
    };
    

    updatePost();

    return () => {
      postChannel.unsubscribe("new-post"); // Cleanup on unmount
      postChannel.unsubscribe("update-post"); // Cleanup on unmount
    };
  }, [postChannel, dispatch]);

  return {
    isLoading,
    content,
    contentType,
    mediaPreview,
    selectedMedia,
    uploadProgress,
    isEditing,
    handleContentChange,
    handleRemoveMedia,
    handleMediaChange,
    handlePostSubmit,
  };
};

export default usePosts;
