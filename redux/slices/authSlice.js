import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';


const initialState = {
  user: typeof window !== 'undefined' && localStorage.getItem('userData')
    ? JSON.parse(localStorage.getItem('userData'))
    : null,
  status: null,
  loading: false,
  error: null,
  usernameAvailable: true,
  userFormData: {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  loginFormData: {
    emailOrUsername: "",
    password: "",
  }
};

// AsyncThunk for registration
export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/auth/register", userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Something went wrong");
  }
});

export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/auth/login", userData);
    return response.data; // Assuming response contains { token, user }
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Something went wrong");
  }
});

export const verifyEmail = createAsyncThunk("auth/verifyEmail", async (token, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/auth/verify-email", token);
    return response.data; // Assuming response contains { token, user }
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Something went wrong");
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/auth/logout");
    return response.data; // Assuming response contains { token, user }
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Something went wrong");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      const { field, value } = action.payload;
      state.userFormData[field] = value;
    },
    setLoginDetails: (state, action) => {
      const { field, value } = action.payload;
      state.loginFormData[field] = value;
    },
    setUsernameAvailability: (state, action) => {
      state.usernameAvailable = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        state.status = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("userData", JSON.stringify(action.payload.user));
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = 'logout';
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
        state.status = action.payload.message;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      ;
  },
});

export const { setUserDetails, setLoginDetails, setUsernameAvailability } = authSlice.actions;
export default authSlice.reducer;
