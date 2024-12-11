// socketManager.js
import { io } from "socket.io-client";

let privateSocket = null;

export const initializePrivateSocket = (user) => {
  if (!privateSocket && user) {
    privateSocket = io(process.env.CLIENT_URL, {
      query: {
        type: "private",
        userId: user._id,
      },
    });
  }
  return privateSocket;
};

export const getPrivateSocket = () => privateSocket;

export const closePrivateSocket = () => {
  if (privateSocket) {
    privateSocket.close();
    privateSocket = null;
  }
};
