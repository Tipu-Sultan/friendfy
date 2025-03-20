import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPost,
  updatePost,
  setPostFormData,
  addNewPost,
  updateExistingPost,
  likeOrUnlikePost,
  deletePost,
  updateLikeIntoPost,
  updateDeletePost,
} from "@/redux/slices/postSlice";
import { useUser } from "./useUser";
import { getAblyClient } from "@/lib/ablyClient";
import { toast } from "./use-toast";

const usePosts = (editingPost, setEditingPost) => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const ablyClient = getAblyClient(user?.id);
  const postChannel = ablyClient?.channels?.get("add-post-actions");
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
    }
  }, [editingPost, dispatch]);

  const resetForm = () => {
    setIsEditing(false);
    setPostId(null);
    setEditingPost(null);
    setSelectedMedia(null);
    setMediaPreview(null);
    setUploadProgress(0);
    dispatch(setPostFormData({ content: "", contentType: "" }));
  };

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
      toast({ title: "Error", description: "Please provide content or select a media file." });
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
        response = await dispatch(updatePost({ updatedData: formData })).unwrap();
      } else {
        response = await dispatch(createPost(formData)).unwrap();
      }

      if (response.status === 201 || response.status === 200) {
        if (isEditing && postId) {
          postChannel?.publish("update-post", {
            userId: user.id,
            updatedFields: response.updatedFields,
            postId,
          });
          toast({ title: "Post Updated", description: "Your post has been successfully updated." });

        } else {
          postChannel?.publish("new-post", {
            userId: user.id,
            post: response.post,
          });
          toast({ title: "Post Updated", description: "Your post has been successfully published." });
        }

        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 500);

        resetForm();
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      toast({ title: "Error",variant: "destructive", description: "Failed to save post. Please try again." });

      setUploadProgress(0);
    }
  };

  useEffect(() => {
    if (!postChannel) return;

    const handleNewPost = (message) => {
      const newPost = message.data.post;
      dispatch(addNewPost(newPost));
    };

    const handleUpdatePost = (message) => {
      const { updatedFields, postId } = message.data;
      dispatch(updateExistingPost({ postId, updatedFields }));
    };

    postChannel.subscribe("new-post", handleNewPost);
    postChannel.subscribe("update-post", handleUpdatePost);

    return () => {
      postChannel.unsubscribe("new-post", handleNewPost);
      postChannel.unsubscribe("update-post", handleUpdatePost);
    };
  }, [postChannel, dispatch]);

  return {
    postChannel,
    posts,
    isLoading,
    content,
    contentType,
    mediaPreview,
    selectedMedia,
    uploadProgress,
    isEditing,
    editingPost, 
    setEditingPost,
    handleContentChange,
    handleRemoveMedia,
    handleMediaChange,
    handlePostSubmit,
  };
};

export default usePosts;
