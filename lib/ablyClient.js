import Ably from "ably";

let ablyClient = null;

export function getAblyClient(clientId) {
  if (!ablyClient && clientId) {
    ablyClient = new Ably.Realtime({
      key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
      clientId: clientId,
    });

    ablyClient.connection.on("connected", async () => {
      console.log(`✅ Connected: ${clientId}`);

    });

    ablyClient.connection.on("disconnected", async () => {
      console.log(`❌ Disconnected: ${clientId}`);
    });
  }
  return ablyClient;
}


