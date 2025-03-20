import axios from "axios";

const API_BASE_URL = "/api/post";

// Centralized Axios/Fetch-based service functions
export const postService = {
  createPost: async (formData) => {
    const response = await axios.post(`${API_BASE_URL}/index`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updatePost: async (updatedData) => {
    const response = await axios.put(`${API_BASE_URL}/index`, updatedData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await axios.delete(`${API_BASE_URL}/index/${postId}`);
    return response.data;
  },

  likeOrUnlikePost: async ({ postId, userId }) => {
    const response = await axios.post(`${API_BASE_URL}/like`, { postId, userId });
    return response.data;
  },

  fetchPosts: async () => {
    const response = await axios.get(`${API_BASE_URL}/index`);
    return response.data;
  },

  addComment: async ({ postId, userId, text }) => {
    const response = await fetch(`${API_BASE_URL}/${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, text }),
    });
    if (!response.ok) throw new Error((await response.json()).message || "Failed to add comment");
    return response.json();
  },

  addReply: async ({ postId, commentId, userId, text }) => {
    const response = await fetch(`${API_BASE_URL}/${postId}/comment/${commentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, text }),
    });
    if (!response.ok) throw new Error((await response.json()).message || "Failed to add reply");
    return response.json();
  },

  deleteComment: async ({ postId, commentId }) => {
    const response = await fetch(`${API_BASE_URL}/${postId}/comment/${commentId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete comment");
    return { postId, commentId };
  },

  deleteReply: async ({ postId, commentId, replyId }) => {
    const response = await fetch(`${API_BASE_URL}/${postId}/comment/${commentId}/reply/${replyId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete reply");
    return { postId, commentId, replyId };
  },

  reportPost: async ({ postId, reason, details }) => {
    const response = await fetch(`${API_BASE_URL}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, reason, details }),
    });
    if (!response.ok) throw new Error((await response.json()).error || "Failed to report post");
    return response.json();
  },
};