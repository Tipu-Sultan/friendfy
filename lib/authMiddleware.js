import jwt from "jsonwebtoken";

export const authenticateUser = (req) => {
  const authToken = req.cookies?.authToken; 

  if (!authToken) {
    return null;
  }

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};
