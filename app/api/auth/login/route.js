import dbConnect from "@/lib/db"; // Database connection
import UserModel from "@/models/UserModel"; // User model
import bcrypt from "bcryptjs"; // For password comparison
import jwt from "jsonwebtoken"; // For generating JWT

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
            expiresIn: "1h",
        });

        // Set token in cookies
        const response = new Response(
            JSON.stringify({status:'success', message: "Login successful", user, token }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );

        response.headers.append(
            "Set-Cookie",
            `authToken=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`
        );

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            {
                status: 500, // Internal server error
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
