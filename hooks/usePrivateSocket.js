import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuthData from "./useAuthData";

const usePrivateSocket = () => {
  const { user } = useAuthData();
  const [privateSocket, setPrivateSocket] = useState(null)

  useEffect(() => {
    if (user) {
      const socket = io(process.env.CLIENT_URL, {
        query: {
          type: "private",
          userId: user._id,
        },
      });

      setPrivateSocket(socket)
      // Cleanup on unmount or user change
      return () => {
        socket.close();
        setPrivateSocket(null)
      };
    } else if (privateSocket) {
      privateSocket.close();
      setPrivateSocket(null)
    }
  }, []);

  return privateSocket;
};

export default usePrivateSocket;
