const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);
    const io = new Server(httpServer);

    const userSocketMap = {};

    io.on("connection", (socket) => {
        console.log("Client connected", socket.id);

        const userId = socket.handshake.query.userId;

        if (userId) {
            // Store or update the socket mapping
            userSocketMap[userId] = socket.id;
        }
        // Leave a group
        socket.on("leaveGroup", (receiver) => {
            socket.leave(receiver);
            console.log(`User ${socket.id} left group ${receiver}`);
        });

        // Join a specific group (room) when a user connects to a group
        socket?.on("joinGroup", ({ receiver, userId }) => {
            if (receiver) {
                socket.join(receiver)
                console.log(`${userId} join ${receiver} `);

            } else {
                console.log("No groupId provided for joinGroup event");
            }
        });

        // Handle sending messages to a group
        socket?.on("groupMessage", (groupMessage) => {
            const { sender, receiver, tempId } = groupMessage;

            io.to(receiver).emit("groupMessageReceived", groupMessage);

            socket?.emit('groupMessageSent', { tempId, status: 'sent' });

            console.log(`Message from ${sender} sent to group ${receiver}`);
        });

        socket?.on('privateMessage', (message) => {
            const { receiver, tempId } = message;
            if (userSocketMap[receiver]) {
                io.to(userSocketMap[receiver]).emit('messageReceived', message);
                socket.emit('messageSent', { tempId, status: 'sent' });
                console.log(`Receiver ${receiver} is not online`);

            } else {
                console.log(`Receiver ${receiver} is not online`);
                // Handle offline case if necessary
            }
        });

        // Handle follow request
        socket?.on("follow-request", ({ userId, targetUserId }) => {
            console.log("Follow request from:", userId, "to:", targetUserId);

            // Notify the receiver of the follow request
            if (userSocketMap[targetUserId]) {
                console.log("Follow request from:", userId, "to:", targetUserId);
                io.to(userSocketMap[targetUserId]).emit("follow-request-received", {
                    userId,
                    targetUserId,
                });
            } else {
                console.log("Target user not online:", targetUserId);
                // Optionally queue the message for later
            }

            // Notify the sender of the follow request
            if (userSocketMap[userId]) {
                io.to(userSocketMap[userId]).emit("follow-request-sent", {
                    userId,
                    targetUserId,
                });
            }
        });

        // Handle follow acceptance
        socket?.on("follow-accept", ({ userId, targetUserId }) => {
            console.log("Follow accepted by:", targetUserId, "from:", userId);

            if (userSocketMap[targetUserId]) {
                io.to(userSocketMap[targetUserId]).emit("follow-update", {
                    userId,
                    targetUserId,
                    status: "confirmed",
                });
            }

            if (userSocketMap[userId]) {
                io.to(userSocketMap[userId]).emit("follow-update", {
                    userId,
                    targetUserId,
                    status: "confirmed",
                });
            }
        });

        // Handle follow request deletion
        socket?.on("follow-request-delete", ({ userId, targetUserId }) => {
            console.log("Follow request deletion by:", userId, "for:", targetUserId);

            if (userSocketMap[targetUserId]) {
                io.to(userSocketMap[targetUserId]).emit("follow-request-deleted", {
                    userId,
                    targetUserId,
                });
            }

            if (userSocketMap[userId]) {
                io.to(userSocketMap[userId]).emit("follow-request-deleted", {
                    userId,
                    targetUserId,
                });
            }
        });

        // Listen for new posts
        socket?.on('new-post', ({ userId, post }) => {
            io?.emit('receive-post', post);

        });

        // Listen for like events
        socket?.on("like-post", ({ postId, userId }) => {
            // Broadcast updated like data to all clients
            io?.emit("post-liked", { postId, userId });
        });

        // Listen for like events
        socket?.on("delete-post", ({ postId}) => {
            // Broadcast updated like data to all clients
            io?.emit("post-deleted", { postId });
        });

        // Listen for like events
        socket?.on("delete-message", ({ msgId, isSender}) => {
            // Broadcast updated like data to all clients
            io.emit("message-deleted", { msgId, isSender });
        });


        // Cleanup on disconnect
        socket?.on("disconnect", () => {
            console.log("Client disconnected", socket.id);

            // Remove user from mapping if they disconnect
            const disconnectedUserId = Object.keys(userSocketMap).find(
                (key) => userSocketMap[key] === socket.id
            );
            if (disconnectedUserId) {
                delete userSocketMap[disconnectedUserId];
            }
        });
    });

    httpServer.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
