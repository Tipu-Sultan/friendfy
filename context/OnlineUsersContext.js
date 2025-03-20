"use client"; // This must be a client component

import { createContext, useState, useContext, useEffect, useRef } from "react";
import Ably from "ably";

const OnlineUsersContext = createContext();

export const OnlineUsersProvider = ({ children, userId }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const ablyClientRef = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // Initialize Ably client only once
    if (!ablyClientRef.current) {
      ablyClientRef.current = new Ably.Realtime({
        key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
        clientId: userId,
      });
    }

    const ablyClient = ablyClientRef.current;
    const channel = ablyClient.channels.get("online-users");
    channelRef.current = channel;

    const connectAndEnterPresence = async () => {
      try {
        // Wait for connection
        if (ablyClient.connection.state !== "connected") {
          await new Promise((resolve) => {
            ablyClient.connection.once("connected", resolve);
          });
        }

        console.log(`✅ Conetxt Ably Connected: ${userId}`);
        await channel.presence.enter(userId);

        // Fetch existing online users
        const presenceMembers = await channel.presence.get();
        setOnlineUsers(presenceMembers.map((m) => m.clientId));

        // Listen for new users joining
        channel.presence.subscribe("enter", (member) => {
          setOnlineUsers((prevUsers) => [...new Set([...prevUsers, member.clientId])]);
        });

        // Listen for users leaving
        channel.presence.subscribe("leave", (member) => {
          setOnlineUsers((prevUsers) => prevUsers.filter((id) => id !== member.clientId));
        });
      } catch (error) {
        console.error("Ably Presence Error:", error);
      }
    };

    connectAndEnterPresence();

    return () => {
      if (channelRef.current) {
        channelRef.current.presence.leave().catch(console.error);
      }
      if (ablyClientRef.current) {
        ablyClientRef.current.close();
        ablyClientRef.current = null;
      }
    };
  }, [userId]);

  return (
    <OnlineUsersContext.Provider value={onlineUsers}>
      {children}
    </OnlineUsersContext.Provider>
  );
};

// Custom hook to access online users
export const useOnlineUsers = () => {
  return useContext(OnlineUsersContext);
};
