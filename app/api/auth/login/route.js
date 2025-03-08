import dbConnect from "@/lib/db"; // Database connection
import UserModel from "@/models/UserModel"; // User model
import bcrypt from "bcryptjs"; // For password comparison
import jwt from "jsonwebtoken"; // For generating JWT";
// import { createSession } from "../../../../lib/server-only";

export async function POST(req) {
  try {
    await dbConnect();

    const { emailOrUsername, password } = await req.json();

    if (!emailOrUsername || !password) {
      return new Response(
        JSON.stringify({ error: "Username/Email and password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Find user by username or email
    const user = await UserModel.findOne({
      $or: [{ username: emailOrUsername }, { email: emailOrUsername }],
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
      return new Response(
        JSON.stringify({
          error: "Your account is not active yet. Please verify your email.",
        }),
        {
          status: 403, // Forbidden
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        {
          status: 401, // Unauthorized
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    // await createSession(user._id)

    // Set token in cookies using `Set-Cookie` header
    return new Response(
      JSON.stringify({
        status: "success",
        message: "Login successful",
        token,
        user: { _id: user._id, profilePicture: user.profilePicture,username: user.username, email: user.email },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `authToken=${token}; HttpOnly; Path=/; Max-Age=10800; ${
            process.env.NODE_ENV === "production" ? "Secure;" : ""
          } SameSite=Strict;`,
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
