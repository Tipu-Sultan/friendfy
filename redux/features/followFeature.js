
const sendFollowRequest = async ({ userId, targetUserId }, { rejectWithValue }) => {
    try {
        // Emit the follow request through Socket.IO for real-time sync
        socket.emit("follow-request", { userId, targetUserId });

        // Send a POST request to the backend API to save the follow request
        const response = await axios.post("/api/follow/index", { userId, targetUserId });

        // Return the follow request data on success
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message); // Return error if request fails
    }
}

export const followFeature = { sendFollowRequest }