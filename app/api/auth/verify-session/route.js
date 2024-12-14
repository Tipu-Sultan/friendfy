import { verifySession } from "../../../../lib/session";

export async function GET(request) {
  try {
    const sessionStatus = verifySession();
    return new Response(JSON.stringify(sessionStatus), { status: 200 });
  } catch (error) {
    console.error('Error verifying session:', error);
    return new Response(JSON.stringify({ isAuth: false }), { status: 401 });
  }
}
