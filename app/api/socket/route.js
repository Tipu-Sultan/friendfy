import { Server } from "socket.io";

export  function GET(req, res) {
    if (!res.socket.server.io) {
        console.log("Initializing Socket.IO server...");
        const io = new Server(res.socket.server, {
            cors: {
                origin: "https://friendfy.vercel.app",
                methods: ["GET", "POST"],
            },
        });

        io.on("connection", (socket) => {
            console.log("New client connected", socket.id);
            socket.on("disconnect", () => {
                console.log("Client disconnected", socket.id);
            });
        });

        res.socket.server.io = io;
    }
    res.end();
}
