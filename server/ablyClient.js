import Ably from "ably";

let ablyClient = null;

export function getAblyClient(clientId = null) {
  if (!ablyClient) {
    ablyClient = new Ably.Realtime({
      key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
      clientId: clientId || null,
    });

    ablyClient.connection.on("connected", async () => {
      console.log(`✅ Connected: ${clientId} ${process.env.NEXT_PUBLIC_ABLY_API_KEY}`);

    });

    ablyClient.connection.on("disconnected", async () => {
      console.log(`❌ Disconnected: ${clientId}`);
    });
  }
  return ablyClient;
}


