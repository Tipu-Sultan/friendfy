import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  content:'',
  users: [],  // This will store the list of users
  recentChats: [],
  messages: [],
  groupsFriends: [],
  groupData: null,
  selectedUser: null,
  chatLoading: null,
  error: null,
};

export const fetchFriends = createAsyncThunk(
  "posts/fetchFriends",
  async (username, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/chat/group/get/${username}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error || "Something went wrong.");
    }
  }
);

export const fetchRecentChats = createAsyncThunk(
  "posts/recentChats",
  async (username, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/chat/user/${username}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error || "Something went wrong.");
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "posts/fetchMessages",
  async ({ sender, receiver, page,type }, { rejectWithValue }) => {
    try {
      let response = null;

      if (type === 'user') {
        response = await axios.post(`/api/chat/user/index`, { sender, receiver, page });
      } else if (type === 'group'){
        response = await axios.post(`/api/chat/group/index`, { sender, receiver, page });
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error || "Something went wrong.");
    }
  }
);

export const fetchPaginationsMessages = createAsyncThunk(
  "posts/fetchPaginationsMessages",
  async ({ sender, receiver, page }, { rejectWithValue }) => {
    try {
      let response = null;

      if (initialState?.selectedUser?.type === 'user') {
        response = await axios.post(`/api/chat/user/index`, { sender, receiver, page });
      } else {
        response = await axios.post(`/api/chat/group/index`, { sender, receiver, page });
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error || "Something went wrong.");
    }
  }
);

// Create a new group
export const createGroup = createAsyncThunk(
  "chat/createGroup",
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/chat/group/create`, groupData);
      return response.data; // Return the created group data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create group");
    }
  }
);

export const joinGroup = createAsyncThunk(
  "chat/joinGroup",
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/chat/group/join`, groupData);
      return response.data; // Return the created group data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create group");
    }
  }
);

export const getGroupDetails = createAsyncThunk(
  "chat/getGroupDetails",
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/chat/group/index/${groupId}`);
      return response.data; // Return the created group data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create group");
    }
  }
);

export const createUser = createAsyncThunk(
  "chat/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/chat/user/create`, userData);
      return response.data; // Return the created group data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create group");
    }
  }
);

export const sendMessages = (messagePayload) => async (dispatch) => {

  try {
    let response = null;

    if (messagePayload?.type === 'user') {
      response = await axios.post(`/api/chat/user/save`, messagePayload);
    } else {
      response = await axios.post(`/api/chat/group/save`, messagePayload);
    }

    const updatedMessage = {
      tempId: messagePayload?.tempId,
      updatedFields: {
        _id: response.data._id,
        status: "sent",
      },
    };

    // Dispatch the update status action
    dispatch({
      type: "chat/updateMessageStatus",
      payload: updatedMessage,
    });
  } catch (error) {
    // Handle failure: mark the message as failed
    dispatch({
      type: "chat/updateMessageStatus",
      payload: {
        tempId: messagePayload.tempId,
        updatedFields: {
          status: "failed", // Indicate the message failed to send
        },
      },
    });
  }
};

export const deleteMessage = createAsyncThunk(
  "chat/deleteMessage",
  async ({ msgId, senderId, isSender, type }, { rejectWithValue }) => {
    try {
      // Determine API endpoint based on type
      const endpoint = type === "group" ? `/api/chat/group/index/${msgId}` : `/api/chat/user/index/${msgId}`;

      const response = await axios.post(endpoint, { senderId, isSender, type });
      return response.data; // Return the updated message data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete message");
    }
  }
);

export const updateBlockStatus = createAsyncThunk(
  "chat/updateBlockStatus",
  async ({ currentUser, UserId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/chat/user/index`, { currentUser, UserId });
      return response.data; // Return updated chat data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update block status");
    }
  }
);


// Slice definition
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {

    addRecentChat: (state, action) => {
      const userExists = state.recentChats.some(user => user.id === action.payload.id);
      if (!userExists) {
        state.recentChats = [...state.recentChats, action.payload];
      }
    },

    addGroupToState: (state, action) => {
      state.recentChats.unshift(action.payload);
    },

    addMessage: (state, action) => {
      const { message } = action.payload;
      const { tempId } = message;

      // Check if the message with the same tempId is already in the array
      const messageExists = state.messages.some((msg) => msg.tempId === tempId);

      if (!messageExists) {
        // Add the new message to the messages array only if it's not already present
        state.messages.push(message);
      }
    },

    updateMessageStatus: (state, action) => {
      const { tempId, updatedFields } = action.payload;

      // Update the message in the state by replacing the tempId with the server id and updating status
      state.messages = state.messages.map((msg) => {
        if (msg.tempId === tempId) {
          return { ...msg, ...updatedFields }; // Update the fields (status, id, etc.)
        }
        return msg;
      });
    },

    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload
    },

    resetPagination: (state) => {
      state.currentPage = 1
      state.totalPages = 0
    },

    setContent:(state,action)=>{
      state.content = action.payload
    },

    updateDeleteMessage: (state, action) => {
      const { msgId, isSender } = action.payload;
    
      state.messages = state.messages.map((message) =>
        message.tempId === msgId
          ? { 
              ...message, 
              ...(isSender ? { deletedBySender: true } : { deletedByReceiver: true }) 
            }
          : message
      );
    },    
    
    updateRecentChats: (state, action) => {
      const { sender, receiver, content } = action.payload.message;
    
      const updateChat = (chatPartnerId, lastMessage) => {
        const chatIndex = state.recentChats.findIndex((chat) => chat.id === chatPartnerId);
    
        if (chatIndex !== -1) {
          // If chat exists, update lastMessage
          state.recentChats[chatIndex].lastMessage = {
            text: lastMessage,
            date: new Date().toISOString(),
          };
          state.recentChats[chatIndex].updatedAt = new Date().toISOString();
        }
      };
    
      // Update recentChats for both sender and receiver
      updateChat(sender, content);
      updateChat(receiver, content);
    },
    

  },
  extraReducers: (builder) => {
    builder
      // Create group
      .addCase(createGroup.pending, (state) => {
        state.chatLoading = 'createGroup';
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        // Ensure previous chats remain, and add the new recentChat at the start
        state.recentChats = [action.payload.recentChat, ...state.recentChats];
        state.chatLoading = null;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.chatLoading = null;
        state.error = action.payload.message;
      })

      .addCase(updateBlockStatus.pending, (state) => {
        state.chatLoading = 'updateBlockStatus';
        state.error = null;
      })
      .addCase(updateBlockStatus.fulfilled, (state, action) => {
        const updatedChat = action.payload.updatedChat;
      
        // Update only the `isBlocked` field in the existing `recentChats` array
        state.recentChats = state.recentChats.map(chat =>
          chat.id === updatedChat.id ? { ...chat, isBlocked: updatedChat.isBlocked } : chat
        );
      
        state.chatLoading = null;
      })
      .addCase(updateBlockStatus.rejected, (state, action) => {
        state.chatLoading = null;
        state.error = action.payload?.message || "Failed to update block status";
      })
      

      .addCase(createUser.pending, (state) => {
        state.chatLoading = 'createUser';
        state.error = null;
      })

      .addCase(createUser.rejected, (state, action) => {
        state.chatLoading = null;
        state.error = action.error.message;
      })


      .addCase(joinGroup.pending, (state) => {
        state.chatLoading = 'joinGroup';
        state.error = null;
      })
      .addCase(joinGroup.fulfilled, (state, action) => {
        // Ensure previous chats remain, and add the new recentChat at the start
        state.recentChats = [action.payload.recentChat, ...state.recentChats];
        state.chatLoading = null;
      })
      .addCase(joinGroup.rejected, (state, action) => {
        state.chatLoading = null;
        state.error = action.payload.message;
      })

      .addCase(getGroupDetails.pending, (state) => {
        state.chatLoading = 'getGroupDetails';
        state.error = null;
      })
      .addCase(getGroupDetails.fulfilled, (state, action) => {
        // Ensure previous chats remain, and add the new recentChat at the start
        state.groupData = action.payload.groupData
        state.chatLoading = null;
      })
      .addCase(getGroupDetails.rejected, (state, action) => {
        state.chatLoading = null;
        state.error = action.payload.message;
      })
      .addCase(fetchFriends.pending, (state) => {
        state.chatLoading = 'fetchFriends';
        state.error = null;
      })

      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.groupsFriends = action.payload.data;
      })

      .addCase(fetchRecentChats.pending, (state) => {
        state.chatLoading = 'fetchRecentChats';
        state.error = null;
      })
      .addCase(fetchRecentChats.fulfilled, (state, action) => {
        state.recentChats = action.payload.recentChats;
        state.chatLoading = null;
      })

      .addCase(fetchPaginationsMessages.pending, (state) => {
        state.chatLoading = 'fetchPaginationsMessages';
      })

      .addCase(fetchPaginationsMessages.fulfilled, (state, action) => {
        state.messages = [...action.payload.messages, ...state.messages];
        state.chatLoading = null;

      })

      .addCase(fetchMessages.pending, (state) => {
        state.chatLoading = 'fetchMessages';
        state.messages = [];
      })

      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload.messages; 
        state.chatLoading = null;

      });


    ;
  }
});

export const { 
  addRecentChat, addGroupToState,
  setSelectedUser, addMessage, updateRecentChats,
  updateMessageStatus, setContent,
  resetPagination,updateDeleteMessage
} = chatSlice.actions;

export default chatSlice.reducer;
