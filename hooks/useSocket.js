import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuthData from "./useAuthData";

export default function useSocket() {
    const { user } = useAuthData();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
       
        if (user) {
            const newSocket = io(process.env.CLIENT_URL, {
                query: {
                    userId: user._id,
                }
            });

            setSocket(newSocket);

            // Cleanup function to close socket when user changes or unmounts
            return () => {
                newSocket.close();
                setSocket(null);
            };
        } else {
            // If no user, close socket if it exists
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, []); 

    return socket; 
}
