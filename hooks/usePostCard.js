import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  likeOrUnlikePost,
  deletePost,
  updateLikeIntoPost,
  updateDeletePost,
} from "@/redux/slices/postSlice";
import { useUser } from "./useUser";
import { getAblyClient } from "@/lib/ablyClient";

const usePostCard = () => {
  const dispatch = useDispatch();
  const { user } = useUser();
  const ablyClient = getAblyClient(user?.id);
  const postChannel = ablyClient?.channels?.get("post-actions");
  const { posts,  } = useSelector((state) => state.posts);
  
  const [showComments, setShowComments] = useState(false);
  const [showReportModal, setReportModal] = useState(false);

  const fileTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


  const handleLikePost = async (postId) => {
    if (!postChannel) return;

    postChannel.publish("like-post", { postId, userId: user.id });

    await dispatch(likeOrUnlikePost({ postId, userId: user.id })).unwrap();
  };

  const handleDeletePost = async (postId) => {
    if (!postChannel) return;

    const res = await dispatch(deletePost(postId)).unwrap();

    if (res.status === 200) {
      postChannel.publish("delete-post", { postId });
    }
  };

  useEffect(() => {
    if (!postChannel) return;

    const likeHandler = (message) => {
      dispatch(updateLikeIntoPost(message.data));
    };

    const deleteHandler = (postData) => {
      dispatch(updateDeletePost({ postId: postData.data.postId }));
    };

    postChannel.subscribe("like-post", likeHandler);
    postChannel.subscribe("delete-post", deleteHandler);

    return () => {
      postChannel.unsubscribe("like-post", likeHandler);
      postChannel.unsubscribe("delete-post", deleteHandler);
    };
  }, [postChannel, dispatch]);

  return {
    postChannel,
    fileTypes,
    showComments, 
    showReportModal, 
    setShowComments,
    setReportModal,
    handleDeletePost,
    handleLikePost
  };
};

export default usePostCard;
