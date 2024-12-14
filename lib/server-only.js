import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Ensure the SECRET key is defined
const secretKey = process.env.JWT_SECRET;
if (!secretKey) throw new Error("SECRET key is not defined");

// Encrypts a payload into a JWT
export async function encrypt(payload) {
  return new Promise((resolve, reject) => {
    sign(payload, secretKey, { algorithm: 'HS256', expiresIn: '1h' }, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
}

// Decrypts and verifies a JWT
export async function decrypt(session = '') {
  return new Promise((resolve, reject) => {
    verify(session, secretKey, { algorithms: ['HS256'] }, (err, payload) => {
      if (err) {
        console.error("Decryption error:", err);
        resolve(null);
      } else {
        resolve(payload);
      }
    });
  });
}

// Creates a session and sets the session cookie
export async function createSession(userId) {
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1-hour expiry
  const session = await encrypt({ userId, expiresAt });

  cookies().set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });

}

export async function updateSession() {
  const session = (await cookies()).get('session')?.value
  const payload = await decrypt(session)
 
  if (!session || !payload) {
    return null
  }
 
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)(
    await cookies()
  ).set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}

// Verifies the session cookie and returns authentication status
export async function verifySession() {
  const sessionCookie = cookies().get('session')?.value;
  const session = await decrypt(sessionCookie);

  if (!session?.userId) {
    redirect('/login');
  }

  return { isAuth: true, userId: Number(session.userId) };
}

// Deletes the session cookie and redirects to login
export function deleteSession() {
  cookies().delete('session');
  redirect('/login');
}
