import dbConnect from "@/lib/db"; // Database connection utility
import UserModel from "@/models/UserModel"; // User model
import jwt from "jsonwebtoken"; // For verifying JWT

export async function POST(req) {
    try {
        await dbConnect(); // Ensure database is connected

        const { token } = await req.json();

        if (!token) {
            return new Response(
                JSON.stringify({ error: "Token is required for verification." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Find the user associated with the decoded token
        const user = await UserModel.findOne({ verificationToken: token });
        if (!user) {
            return new Response(
                JSON.stringify({ error: "User not found." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        // Check if the user is already verified
        if (user.isVerified) {
            return new Response(
                JSON.stringify({ message: "User is already verified." }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        // Update the user's verification status
        user.isVerified = true;
        await user.save();

        return new Response(
            JSON.stringify({ message: "Email verified successfully." }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Verification error:", error.message);
        return new Response(
            JSON.stringify({ error: "Internal server error." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
