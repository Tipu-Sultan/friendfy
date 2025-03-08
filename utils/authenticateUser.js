import dbConnect from "../lib/db"; // Ensure DB connection 
import User from "../models/UserModel";
import bcrypt from "bcryptjs";

async function authenticateUser(email, password) {
  try {
    await dbConnect(); 

    const user = await User.findOne({ email });

    if (!user) {
      return { error: "Invalid email or password" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: "Invalid email or password" };
    }

    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    return { error: "Internal server error" };
  }
}

export default authenticateUser;
