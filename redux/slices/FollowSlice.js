import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Thunks for async actions
export const sendFollowRequest = createAsyncThunk(
    "follow/sendFollowRequest",
    async ({ userId, targetUserId }, { rejectWithValue }) => {
        try {
            // Send a POST request to the backend API to save the follow request
            const response = await axios.post("/api/follow/index", { userId, targetUserId });

            // Return the follow request data on success
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message); // Return error if request fails
        }
    }
);

export const removeFollowRequest = createAsyncThunk(
    "follow/removeFollowRequest",
    async ({ userId, targetUserId }, { rejectWithValue }) => {
        try {
            // Send a DELETE request to the backend API to remove the follow request
            const response = await axios.delete("/api/follow/index", {
                data: { userId, targetUserId },
            });

            // Check if response has data and return it
            if (response.data) {
                return response.data; // Return the follow request data on success
            } else {
                return rejectWithValue("No data received from the server");
            }
        } catch (error) {
            // Return error if request fails
            console.error("Error deleting follow request:", error);
            return rejectWithValue(error.message);
        }
    }
);

export const acceptFollowRequest = createAsyncThunk(
    "follow/acceptFollowRequest",
    async ({ userId, targetUserId }, { rejectWithValue }) => {
        try {
            const response = await axios.put("/api/follow/index", { userId, targetUserId });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchSuggestedFrineds = createAsyncThunk(
    "follow/fetchSuggestedFrineds",
    async (id, { rejectWithValue }) => {
        try {
            // Make the API call to fetch friends data based on userId
            const response = await axios.get(`/api/follow/users/${id}`);
            return response.data; // Return the response data (friends)
        } catch (error) {
            return rejectWithValue(error.message); // Return error if request fails
        }
    }
);

// Initial state
const initialState = {
    suggestedFriends: [], // This includes a follows array for real-time sync
    follows: [],
    loading: null,
    error: null,
};

// Follow slice
const followSlice = createSlice({
    name: "follow",
    initialState,
    reducers: {
        // Reducer to handle real-time updates
        updateFollowStatus: (state, action) => {
            const { userId, targetUserId, status } = action.payload;

            state.suggestedFriends = state?.suggestedFriends?.map((friend) =>
                friend._id === targetUserId || friend._id === userId
                    ? { ...friend, follows: { userId, targetUserId, status } }
                    : friend
            );
        },

        removeFollowStatus: (state, action) => {
            const { userId, targetUserId } = action.payload;

            state.suggestedFriends = state.suggestedFriends.map((friend) =>
                friend._id === targetUserId || friend._id === userId
                    ? { ...friend, follows: null }
                    : friend
            );
        },


    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuggestedFrineds.pending, (state) => {
                state.loading = 'fetchfriends';
                state.error = null;
            })
            .addCase(fetchSuggestedFrineds.fulfilled, (state, action) => {
                state.loading = false;
                state.suggestedFriends = action.payload.users;
            })
            .addCase(fetchSuggestedFrineds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })

            .addCase(sendFollowRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendFollowRequest.fulfilled, (state, action) => {
                state.loading = false;


            })


            .addCase(sendFollowRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(acceptFollowRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(acceptFollowRequest.fulfilled, (state, action) => {
                state.loading = false;
                const { userId, targetUserId, status } = action.payload;

                // Update status in follows
                const followIndex = state.follows.findIndex(
                    (follow) =>
                        follow.userId === userId && follow.targetUserId === targetUserId
                );
                if (followIndex !== -1) {
                    state.follows[followIndex].status = status;
                } else {
                    state.follows.push(action.payload);
                }

                // Update status in suggestedFriends array as well
                const suggestedIndex = state.suggestedFriends.findIndex(
                    (follow) => follow.userId === userId && follow.targetUserId === targetUserId
                );
                if (suggestedIndex !== -1) {
                    state.suggestedFriends[suggestedIndex].status = status;
                } else {
                    state.suggestedFriends.push(action.payload);
                }
            })
            .addCase(acceptFollowRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { updateFollowStatus, removeFollowStatus } = followSlice.actions;

export default followSlice.reducer;
