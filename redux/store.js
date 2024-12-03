import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postReducer from "./slices/postSlice";
import followReducer from "./slices/FollowSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    follow: followReducer,
  },
});

export default store;
