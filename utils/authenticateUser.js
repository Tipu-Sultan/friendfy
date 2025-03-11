import dbConnect from "../lib/db";
import User from "../models/UserModel";
import bcrypt from "bcryptjs";

async function authenticateUser(identifier, password) {
  try {
    await dbConnect();

    // Check for user using email OR username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return { error: "Invalid email/username or password" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: "Invalid email/username or password" };
    }

    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    return { error: "Internal server error" };
  }
}

export default authenticateUser;
