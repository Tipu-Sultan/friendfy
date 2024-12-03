// pages/api/check-username.js
import dbConnect from "@/lib/db";
import UserModel from "@/models/UserModel";

export default async function handler(req, res) {
  const { username } = req.query;
  try {
    await dbConnect();

    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return res.status(200).json({ available: false });
    }

    return res.status(200).json({ available: true });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
