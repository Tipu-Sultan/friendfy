// lib/ablyClient.js
import Ably from 'ably';

let ablyClient = null;

export function getAblyClient(clientId = null) {
  if (!ablyClient) {
    ablyClient = new Ably.Realtime({
      key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
      clientId: clientId || null, 
    });
  }
  return ablyClient;
}
