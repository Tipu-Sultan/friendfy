import { createSlice } from '@reduxjs/toolkit';

const onlineUserSlice = createSlice({
  name: 'onlineUsers',
  initialState: {
    onlineUser: null,
  },
  reducers: {
    setOnlineUser: (state, action) => {
      state.authUser = action.payload;
    },
  },
});

export const { setOnlineUser } = onlineUserSlice.actions;
export default onlineUserSlice.reducer;
