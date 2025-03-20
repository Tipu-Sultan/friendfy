import { createAsyncThunk } from "@reduxjs/toolkit";
import { postService } from "../services/postServices";

// Thunks
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async (_, { rejectWithValue }) => {
  try {
    return await postService.fetchPosts();
  } catch (error) {
    return rejectWithValue(error.message || "Failed to fetch posts");
  }
});

export const createPost = createAsyncThunk("posts/createPost", async (formData, { rejectWithValue }) => {
  try {
    return await postService.createPost(formData);
  } catch (error) {
    return rejectWithValue(error.message || "Failed to create post");
  }
});

export const updatePost = createAsyncThunk("posts/updatePost", async (updatedData, { rejectWithValue }) => {
  try {
    return await postService.updatePost(updatedData);
  } catch (error) {
    return rejectWithValue(error.message || "Failed to update post");
  }
});

export const deletePost = createAsyncThunk("posts/deletePost", async (postId, { rejectWithValue }) => {
  try {
    return await postService.deletePost(postId);
  } catch (error) {
    return rejectWithValue(error.message || "Failed to delete post");
  }
});

export const likeOrUnlikePost = createAsyncThunk("posts/likeOrUnlikePost", async ({ postId, userId }, { rejectWithValue }) => {
  try {
    return await postService.likeOrUnlikePost({ postId, userId });
  } catch (error) {
    return rejectWithValue(error.message || "Failed to like/unlike post");
  }
});

export const addComment = createAsyncThunk("posts/addComment", async ({ postId, userId, text }, { rejectWithValue }) => {
  try {
    return await postService.addComment({ postId, userId, text });
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const addReply = createAsyncThunk("posts/addReply", async ({ postId, commentId, userId, text }, { rejectWithValue }) => {
  try {
    return await postService.addReply({ postId, commentId, userId, text });
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteComment = createAsyncThunk("posts/deleteComment", async ({ postId, commentId }, { rejectWithValue }) => {
  try {
    return await postService.deleteComment({ postId, commentId });
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deleteReply = createAsyncThunk("posts/deleteReply", async ({ postId, commentId, replyId }, { rejectWithValue }) => {
  try {
    return await postService.deleteReply({ postId, commentId, replyId });
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const reportPost = createAsyncThunk("posts/reportPost", async ({ postId, reason, details }, { rejectWithValue }) => {
  try {
    return await postService.reportPost({ postId, reason, details });
  } catch (error) {
    return rejectWithValue(error.message);
  }
});