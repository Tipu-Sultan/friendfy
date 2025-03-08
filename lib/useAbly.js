import { useEffect, useState } from "react";
import * as Ably from "ably";

export default function useAbly() {
  const [ablyClient, setAblyClient] = useState(null);
  useEffect(() => {
    // Initialize Ably client
    const ably = new Ably.Realtime(process.env.NEXT_PUBLIC_ABLY_API_KEY);
    ably.connection.once("connected", () => {
      console.log("Connected to Ably!", ably)
    })

    ably.connection.on("connected", () => {
      console.log("Connected to Ably!");
      setAblyClient(ably); // Set the client once connected
    });

    // Clean up connection on component unmount
    return () => {
      ably.close();
      console.log("Ably connection closed");
    };
  }, []);

  return { ablyClient };
}
