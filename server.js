const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

// Determine the environment and settings
const dev = process.env.NODE_ENV !== "production";
const hostname = dev ? "localhost" : "friendfy.vercel.app";
const port = process.env.PORT || 3000; // Use environment variable for production port

// Initialize the Next.js app
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);
    const io = new Server(httpServer, {
        cors: {
            origin: dev ? "http://localhost:3000" : "https://friendfy.vercel.app",
            methods: ["GET", "POST"],
        },
    });

    const userSocketMap = {};

    io.on("connection", (socket) => {
        console.log("Client connected", socket.id);

        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap[userId] = socket.id; // Store user socket mapping
        }

        // Handle joining a group
        socket.on("joinGroup", ({ receiver, userId }) => {
            if (receiver) {
                socket.join(receiver);
                console.log(`${userId} joined group ${receiver}`);
            } else {
                console.log("No groupId provided for joinGroup event");
            }
        });

        // Handle leaving a group
        socket.on("leaveGroup", (receiver) => {
            socket.leave(receiver);
            console.log(`User ${socket.id} left group ${receiver}`);
        });

        // Group messaging
        socket.on("groupMessage", (groupMessage) => {
            const { sender, receiver, tempId } = groupMessage;
            io.to(receiver).emit("groupMessageReceived", groupMessage);
            socket.emit("groupMessageSent", { tempId, status: "sent" });
            console.log(`Message from ${sender} sent to group ${receiver}`);
        });

        // Private messaging
        socket.on("privateMessage", (message) => {
            const { receiver, tempId } = message;
            if (userSocketMap[receiver]) {
                io.to(userSocketMap[receiver]).emit("messageReceived", message);
                socket.emit("messageSent", { tempId, status: "sent" });
            } else {
                console.log(`Receiver ${receiver} is not online`);
            }
        });

        // Follow request handling
        socket.on("follow-request", ({ userId, targetUserId }) => {
            if (userSocketMap[targetUserId]) {
                io.to(userSocketMap[targetUserId]).emit("follow-request-received", { userId, targetUserId });
            }
            io.to(userSocketMap[userId]).emit("follow-request-sent", { userId, targetUserId });
        });

        // Follow accept handling
        socket.on("follow-accept", ({ userId, targetUserId }) => {
            const followUpdate = { userId, targetUserId, status: "confirmed" };
            if (userSocketMap[targetUserId]) io.to(userSocketMap[targetUserId]).emit("follow-update", followUpdate);
            if (userSocketMap[userId]) io.to(userSocketMap[userId]).emit("follow-update", followUpdate);
        });

        // Handle follow request deletion
        socket.on("follow-request-delete", ({ userId, targetUserId }) => {
            const deleteUpdate = { userId, targetUserId };
            if (userSocketMap[targetUserId]) io.to(userSocketMap[targetUserId]).emit("follow-request-deleted", deleteUpdate);
            if (userSocketMap[userId]) io.to(userSocketMap[userId]).emit("follow-request-deleted", deleteUpdate);
        });

        // New post notification
        socket.on("new-post", ({ userId, post }) => {
            io.emit("receive-post", post);
        });

        // Post like handling
        socket.on("like-post", ({ postId, userId }) => {
            io.emit("post-liked", { postId, userId });
        });

        // Post deletion
        socket.on("delete-post", ({ postId }) => {
            io.emit("post-deleted", { postId });
        });

        // Message deletion
        socket.on("delete-message", ({ msgId, isSender }) => {
            io.emit("message-deleted", { msgId, isSender });
        });

        // Handle client disconnection
        socket.on("disconnect", () => {
            console.log("Client disconnected", socket.id);
            const disconnectedUserId = Object.keys(userSocketMap).find((key) => userSocketMap[key] === socket.id);
            if (disconnectedUserId) {
                delete userSocketMap[disconnectedUserId];
            }
        });
    });

    // Start the server
    httpServer.listen(port, () => {
        console.log(`> Server ready on http://${hostname}:${port}`);
    });
});
