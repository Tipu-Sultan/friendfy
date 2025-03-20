"use client"; // Needed for Next.js (if using app router)

import { createContext, useContext, useEffect, useState } from "react";
import Ably from "ably";

const AblyContext = createContext(null);

export function AblyProvider({ clientId = null, children }) {
  const [ablyClient, setAblyClient] = useState(null);

  useEffect(() => {
    const client = new Ably.Realtime({
      key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
      clientId: clientId || null,
    });

    client.connection.on("connected", () => {
      console.log(`✅ Connected: ${clientId}`);
    });

    client.connection.on("disconnected", () => {
      console.log(`❌ Disconnected: ${clientId}`);
    });

    setAblyClient(client);

    return () => {
      client.connection.close();
      console.log(`🔌 Ably Client Disconnected: ${clientId}`);
    };
  }, [clientId]); // Runs when clientId changes

  return (
    <AblyContext.Provider value={ablyClient}>{children}</AblyContext.Provider>
  );
}

// Custom hook to use Ably in any component
export function useAbly() {
  return useContext(AblyContext);
}
