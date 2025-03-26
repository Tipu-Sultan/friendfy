import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/onlineUserSlice';

const store = configureStore({
  reducer: {
    onlineUsers: userReducer,
  },
});

export default store;
