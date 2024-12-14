import { serialize, parse } from "cookie";

// Configuration
const SESSION_COOKIE_NAME = "session_token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 60 * 60 * 24, // 1 day
};

// Mock database for session storage
const sessions = new Map(); // Replace this with your database integration (e.g., MongoDB, Redis)

/**
 * Create a new session.
 * @param {object} res - The HTTP response object.
 * @param {string} userId - The user's unique identifier.
 * @returns {string} The created session token.
 */
export function createSession(res, userId) {
  const sessionToken = generateToken();
  sessions.set(sessionToken, { userId, createdAt: Date.now() });

  const cookie = serialize(SESSION_COOKIE_NAME, sessionToken, COOKIE_OPTIONS);
  res.setHeader("Set-Cookie", cookie);

  return sessionToken;
}

/**
 * Verify an existing session.
 * @param {object} req - The HTTP request object.
 * @returns {object|null} The session data or null if invalid.
 */
export function verifySession(req) {
  const cookies = parse(req.headers.cookie || "");
  const sessionToken = cookies[SESSION_COOKIE_NAME];

  if (!sessionToken) return null;

  const session = sessions.get(sessionToken);

  if (!session) return null;

  return session;
}

/**
 * Delete a session.
 * @param {object} res - The HTTP response object.
 * @param {string} sessionToken - The session token to delete.
 */
export function deleteSession(res, sessionToken) {
  sessions.delete(sessionToken);

  const cookie = serialize(SESSION_COOKIE_NAME, "", {
    ...COOKIE_OPTIONS,
    maxAge: 0, // Invalidate the cookie
  });
  res.setHeader("Set-Cookie", cookie);
}

/**
 * Generate a random session token.
 * @returns {string} A unique session token.
 */
function generateToken() {
  return [...Array(30)]
    .map(() => Math.random().toString(36)[2])
    .join("");
}
