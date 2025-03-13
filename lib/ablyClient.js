import Ably from "ably";

let ablyClient = null;

export function getAblyClient(clientId = null) {
  if (!ablyClient || clientId) {
    ablyClient = new Ably.Realtime({
      key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
      clientId: clientId || null,
    });

    ablyClient.connection.on("connected", async () => {
      console.log(`✅ Connected: ${clientId}`);
      if (clientId) {
        const channel = ablyClient.channels.get("presence:online-users");
        await channel.presence.enter({ userId: clientId });
      }
    });

    ablyClient.connection.on("disconnected", async () => {
      console.log(`❌ Disconnected: ${clientId}`);
      if (clientId) {
        const channel = ablyClient.channels.get("presence:online-users");
        await channel.presence.leave();
      }
    });
  }
  return ablyClient;
}

// Function to get online users
export async function getOnlineUsers() {
  if (!ablyClient) return [];

  const channel = ablyClient.channels.get("presence:online-users");
  const presenceMembers = await channel.presence.get(); // Fetch all online users
  return presenceMembers.map((member) => member.clientId);
}

