import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import useAuthData from "./useAuthData";

const useBroadcastSocket = () => {
  const { user } = useAuthData();
  const [broadcastSocket, setBroadcastSocket] = useState(null);

  useEffect(() => {
    // Initialize the socket connection
    const socket = io(process.env.CLIENT_URL, {
      query: { type: "broadcast" },
      userId: user?._id,
      transports: ["websocket"], 
    });

    // Event handlers
    socket?.on("connect", () => {
      console.log("Broadcast socket connected:", socket.id);
    });

    socket?.on("disconnect", () => {
      console.log("Broadcast socket disconnected");
    });

    socket?.on("connect_error", (error) => {
      console.error("Broadcast socket connection error:", error);
    });

    // Set the socket instance
    setBroadcastSocket(socket);

    // Cleanup on unmount
    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
      socket?.off("connect_error");
      socket?.close();
      setBroadcastSocket(null);
    };
  }, []);

  // Join a group
  const socketjoinGroup = useCallback(
    (groupId) => {
      if (broadcastSocket) {
        broadcastSocket.emit("joinGroup", groupId);
        console.log(`Joined group: ${groupId}`);
      }
    },
    [broadcastSocket]
  );

  // Leave a group
  const leaveGroup = useCallback(
    (groupId) => {
      if (broadcastSocket) {
        broadcastSocket.emit("leaveGroup", groupId);
        console.log(`Left group: ${groupId}`);
      }
    },
    [broadcastSocket]
  );

  // Send a message to a group
  const sendMessage = useCallback(
    (message) => {
      if (broadcastSocket) {
        broadcastSocket.emit("groupMessage", message);
        console.log("Message sent to group:", message);
      }
    },
    [broadcastSocket]
  );

  return {
    broadcastSocket,
    socketjoinGroup,
    leaveGroup,
    sendMessage,
  };
};

export default useBroadcastSocket;
