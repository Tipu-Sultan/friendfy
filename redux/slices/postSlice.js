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
  async ({postId,userId}, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/post/like", { postId, userId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || "Something went wrong.");
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
      return rejectWithValue(error.response.data.error || "Something went wrong.");
    }
  }
);

// Initial state

const initialState = {
  reduxPost: [],
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
      state.postFormData = { content: "", mediaFile: null, contentType: "text/plain" };
    },

    updateLikeIntoPost: (state, action) => {
      const { userId, postId } = action.payload;
    
      state.reduxPost = state.reduxPost.map((post) =>
        post._id === postId
          ? {
              ...post, // Ensure other properties of the post are retained
              likes: post.likes.includes(userId)
                ? post.likes.filter((id) => id !== userId) 
                : [...post.likes, userId], 
            }
          : post
      );
    },

    addNewPost(state, action) {
      state.reduxPost.push(action.payload); 
    },

    setPosts(state, action) {
      state.reduxPost = action.payload; 
    },

    updateDeletePost(state, action) {
      const { postId } = action.payload;
      state.reduxPost = state.reduxPost.filter(post => post._id !== postId); // Remove post by ID
    },
    
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(likeOrUnlikePost.pending, (state) => {
        state.isLoading = 'likeOrUnlikePost';
      })
      .addCase(likeOrUnlikePost.fulfilled, (state,action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(likeOrUnlikePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = 'fetchPosts';
      })
      .addCase(fetchPosts.fulfilled, (state,action) => {
        state.isLoading = false;
        state.error = null;
        state.reduxPost = action.payload.posts;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createPost.pending, (state) => {
        state.isLoading = 'createPost';
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
        state.isLoading = 'deletePost';
      })
      .addCase(deletePost.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      ;
  },
});

export const { setPostFormData, resetPostFormData,updateLikeIntoPost,addNewPost,updateDeletePost,setPosts } = postSlice.actions;
export default postSlice.reducer;
