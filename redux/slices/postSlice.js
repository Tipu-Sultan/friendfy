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

export const likeOrUnlikePost = createAsyncThunk(
  "posts/likeOrUnlikePost ",
  async ({postId,userID}, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/post/index", postId,userID);
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
  posts: [],
  postFormData: {
    content: "",
    file: null,
    contentType: "text/plain",
  },
  isLoading: false,
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPosts.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.posts = action.payload.posts;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(likeOrUnlikePost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(likeOrUnlikePost.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.posts = action.payload.posts;
      })
      .addCase(likeOrUnlikePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      ;
  },
});

export const { setPostFormData, resetPostFormData } = postSlice.actions;
export default postSlice.reducer;
