import jwt from 'jsonwebtoken';

export const authenticateUser = (req) => {
  const token = req.cookies?.authToken; // Get token from cookies
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // Contains userId and other payload data
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};
