import Ably from "ably";

export async function GET(req) {
  const ablyApiKey = process.env.ABLY_API_KEY; // Ensure API key is in .env
  if (!ablyApiKey) {
    return Response.json(
      { success: false, message: "ABLY_API_KEY is not set" },
      { status: 500 }
    );
  }

  try {
    const client = new Ably.Rest(ablyApiKey);
    const tokenParams = { capability: '{"*":["publish", "subscribe"]}' };

    const tokenRequest = await new Promise((resolve, reject) => {
      client.auth.createTokenRequest(tokenParams, (err, tokenRequest) => {
        if (err) reject(err);
        else resolve(tokenRequest);
      });
    });

    return Response.json({ success: true, tokenRequest }, { status: 200 });
  } catch (error) {
    console.error("Error generating Ably token:", error);
    return Response.json(
      { success: false, message: "Failed to generate Ably token" },
      { status: 500 }
    );
  }
}
