import jwt from 'jsonwebtoken';

export default function GET(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
