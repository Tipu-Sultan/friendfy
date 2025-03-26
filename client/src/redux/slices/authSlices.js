import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// API Host
const API_HOST = process.env.REACT_APP_API_HOST;

// Initial State
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,
  onlineUsers: [],
  socket: null,
};

// Thunks

// Login User
export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_HOST}/api/auth/login`, userData);
      const token = response?.data?.token;

      // Fetch user details
      const userDetailsResponse = await axios.get(`${API_HOST}/api/auth/user-details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userDetailsResponse.data));

      // Remember me
      if (userData?.rememberMe) {
        localStorage.setItem('rememberMe', JSON.stringify(userData));
      } else {
        localStorage.removeItem('rememberMe');
      }

      toast.success(response?.data?.message);
      return { token, user: userDetailsResponse.data };
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

// Logout User
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      if (token) {
        await axios.post(
          `${API_HOST}/api/auth/logout`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      localStorage.removeItem('userData');
      localStorage.removeItem('token');
      toast.success('Logout successful');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
      return rejectWithValue('Failed to logout.');
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (userValue, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_HOST}/api/auth/forgot-password`, { userValue });
      toast.success(response.data.message);
      return response.data.message;
    } catch (error) {
      toast.error('An error occurred while processing your request.');
      return rejectWithValue(error.response?.data?.error || 'Password reset failed');
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetInput, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_HOST}/api/auth/reset-password`, resetInput);
      toast.success(response.data.message);
      return response.data.message;
    } catch (error) {
      toast.error('An error occurred while processing your request.');
      return rejectWithValue(error.response?.data?.error || 'Password reset failed');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.onlineUsers = [];
      state.socket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.onlineUsers = [];
        state.socket = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setOnlineUsers, setSocket, clearAuth } = authSlice.actions;

export default authSlice.reducer;
