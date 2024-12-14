'use client'
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import useAuthData from "../hooks/useAuthData";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuthData();
  const privateSocket = useMemo(() => {
    if (user) {
      return io(process.env.SOCKET_URL, {
        query: {
          type: "private",
          userId: user._id,
        },
      });
    }
    return null;
  }, [user]);

  useEffect(() => {
    return () => {
      privateSocket?.close();
    };
  }, [privateSocket]);

  return (
    <SocketContext.Provider value={privateSocket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
