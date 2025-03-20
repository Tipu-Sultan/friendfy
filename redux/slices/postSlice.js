import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to create a new post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/post/index", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Something went wrong.");
    }
  }
);

// Async thunk for updating a post
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/post/index`, updatedData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data; // Returns the updated post
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update post");
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/post/index/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Something went wrong.");
    }
  }
);

export const likeOrUnlikePost = createAsyncThunk(
  "posts/likeOrUnlikePost ",
  async ({ postId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/post/like", { postId, userId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Something went wrong.");
    }
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ postId, userId, text }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/post/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to add comment");

      return { postId, comment: data.comment };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addReply = createAsyncThunk(
  "comments/addReply",
  async ({ postId, commentId, userId, text }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/post/${postId}/comment/${commentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add reply");

      return { postId, commentId, reply: data.reply };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to delete a comment
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/post/${postId}/comment/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete comment");
      return { postId, commentId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteReply = createAsyncThunk(
  "comments/deleteReply",
  async ({ postId, commentId, replyId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `/api/post/${postId}/comment/${commentId}/reply/${replyId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete reply");
      return { postId, commentId, replyId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const reportPost = createAsyncThunk(
  "report/reportPost",
  async ({ postId, reason, details }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/post/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, reason, details }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to report post");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/post/index");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.error || "Something went wrong."
      );
    }
  }
);

// Initial state

const initialState = {
  posts: [],
  postFormData: {
    content: "",
    file: null,
    contentType: "text/plain",
  },
  isLoading: null,
  error: null,
};

// Posts slice
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPostFormData: (state, action) => {
      state.postFormData = { ...state.postFormData, ...action.payload };
    },
    resetPostFormData: (state) => {
      state.postFormData = {
        content: "",
        mediaFile: null,
        contentType: "text/plain",
      };
    },

    updateLikeIntoPost: (state, action) => {
      const { userId, postId } = action.payload;
        
      const updatedPosts = state.posts.map((post) => {
        if (post._id === postId) {
          const isLiked = post.likes.includes(userId);    
          return {
            ...post,
            likes: isLiked
              ? post.likes.filter((id) => id !== userId) // Unlike
              : [...post.likes, userId], // Like
          };
        }
        return post;
      });
    
      state.posts = [...updatedPosts]; // Ensure immutability
    
      console.log("After update:", JSON.parse(JSON.stringify(state.posts))); // Deep copy to avoid reference issues
    },
    

    updatePostComment: (state, action) => {
      const { postId, comment } = action.payload; // Expecting full comment object from server

      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: [...post.comments, comment], // Add comment as received
              }
            : post
        ),
      };
    },

    updatePostAfterDeleteComment: (state, action) => {
      const { postId, commentId } = action.payload;

      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment._id !== commentId
                ), // Remove deleted comment
              }
            : post
        ),
      };
    },

    updatePostReply: (state, action) => {
      const { postId, commentId, reply } = action.payload;

      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === commentId
                    ? {
                        ...comment,
                        replies: [...comment.replies, reply], // Add reply to correct comment
                      }
                    : comment
                ),
              }
            : post
        ),
      };
    },

    updatePostAfterDeleteReply: (state, action) => {
      const { postId, commentId, replyId } = action.payload;

      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment._id === commentId
                    ? {
                        ...comment,
                        replies: comment.replies.filter(
                          (reply) => reply._id !== replyId
                        ), // Remove deleted reply
                      }
                    : comment
                ),
              }
            : post
        ),
      };
    },

    addNewPost(state, action) {
      state.posts.push(action.payload);
    },

    updateExistingPost: (state, action) => {
      const { postId, updatedFields } = action.payload;
      const index = state.posts.findIndex((post) => post._id === postId);

      if (index !== -1) {
        state.posts[index] = { ...state.posts[index], ...updatedFields }; // Merge updated fields
      }
    },

    setPosts(state, action) {
      state.posts = action.payload;
    },

    updateDeletePost(state, action) {
      const { postId } = action.payload;
      state.posts = state.posts.filter((post) => post._id !== postId); // Remove post by ID
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(likeOrUnlikePost.pending, (state) => {
        state.isLoading = "likeOrUnlikePost";
      })
      .addCase(likeOrUnlikePost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(likeOrUnlikePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = "fetchPosts";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.posts = action.payload.posts;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createPost.pending, (state) => {
        state.isLoading = "createPost";
      })
      .addCase(createPost.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deletePost.pending, (state) => {
        state.isLoading = "deletePost";
      })
      .addCase(deletePost.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setPostFormData,
  addNewComment,
  updatePostReply,
  updatePostComment,
  updatePostAfterDeleteComment,
  updatePostAfterDeleteReply,
  resetPostFormData,
  updateLikeIntoPost,
  addNewPost,
  updateExistingPost,
  updateDeletePost,
  setPosts,
} = postSlice.actions;
export default postSlice.reducer;
