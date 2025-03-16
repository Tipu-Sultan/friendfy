import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  user: null,
  onlineUsers: [],
  profileData: null,
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
  },
  resetFormData: {
    resetOtp: "",
    password: "",
    confirmedPassword: "",
  },
  forgotEmail: "",
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

export const fetchUsersDetails = createAsyncThunk(
  "follow/fetchUsersDetails",
  async (username, { rejectWithValue }) => {
      try {
          // Make the API call to fetch friends data based on userId
          const response = await axios.get(`/api/auth/user/${username}`);
          return response.data; // Return the response data (friends)
      } catch (error) {
          return rejectWithValue(error.message); // Return error if request fails
      }
  }
);

export const verifyEmail = createAsyncThunk("auth/verifyEmail", async (token, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/auth/verify-email", token);
    return response.data; // Assuming response contains { token, user }
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Something went wrong");
  }
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await axios.post("/api/auth/reset-password", { email });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Something went wrong");
  }
});

export const resetPassowrd = createAsyncThunk("auth/resetPassowrd", async (resetData, { rejectWithValue }) => {
  try {
    const response = await axios.put("/api/auth/reset-password", resetData);
    return response.data; // Assuming response contains { token, user }
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Something went wrong");
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
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

    setOnlineUsers: (state, action) => {
      state.onlineUsers = Array.from(new Set([...state.onlineUsers, ...action.payload]));
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter((id) => id !== action.payload);
    },
    

    setLoginDetails: (state, action) => {
      const { field, value } = action.payload;
      state.loginFormData[field] = value;
    },
    setResetDetails: (state, action) => {
      const { field, value } = action.payload;
      state.resetFormData[field] = value;
    },
    setForgotEmail: (state, action) => {
      state.forgotEmail = action.payload;
    },
    setUsernameAvailability: (state, action) => {
      state.usernameAvailable = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = 'registerUser';
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
        state.loading = 'loginUser';
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

      .addCase(fetchUsersDetails.pending, (state) => {
        state.loading = 'fetchUsersDetails';
        state.error = null;
      })
      .addCase(fetchUsersDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData = action.payload.data;
        state.error = null;
      })
      .addCase(fetchUsersDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loading = 'forgotPassword';
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.status = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(resetPassowrd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassowrd.fulfilled, (state, action) => {
        state.loading = 'resetPassowrd';
        state.error = null;
        state.status = action.payload.message;
      })
      .addCase(resetPassowrd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = 'logout';
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
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

export const {setOnlineUsers,removeOnlineUser, setUserDetails, setLoginDetails, setForgotEmail, setResetDetails, setUsernameAvailability} = authSlice.actions;
export default authSlice.reducer;
