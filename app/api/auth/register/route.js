import dbConnect from "@/lib/db";
import UserModel from "@/models/UserModel";
import generateToken from "@/utils/generateToken";
import { sendVerificationEmail } from "../../../../utils/sendEmail";


export async function POST(req) {
    try {
        await dbConnect();
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
        }

        if (password.length < 8) {
            return new Response(JSON.stringify({ error: "Password must be at least 8 characters" }), { status: 400 });
        }

        const userExists = await UserModel.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return new Response(JSON.stringify({ error: "Username or email already taken" }), { status: 400 });
        }

        // Generate a verification token
        const verificationToken = generateToken();

        // Construct verification URL
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verificationUrl);

        if (!emailResponse.success) {
            return new Response(JSON.stringify({ error: "Failed to send verification email" }), { status: 500 });
        }

        const newUser = new UserModel({
            username,
            email,
            password,
            isVerified: false,
            verificationToken
        });

        await newUser.save();

        return new Response(JSON.stringify({ message: "User registered successfully. Please check your email to verify your account." }), {
            status: 201,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
