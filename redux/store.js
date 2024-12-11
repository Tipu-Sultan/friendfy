import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postReducer from "./slices/postSlice";
import followReducer from "./slices/FollowSlice";
import chatReducer from "./slices/chatSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    follow: followReducer,
    chat: chatReducer,

  },
});

export default store;
