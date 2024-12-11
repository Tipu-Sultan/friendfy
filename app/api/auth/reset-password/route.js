import dbConnect from "@/lib/db";
import UserModel from "@/models/UserModel";
import { sendOTPEmail } from "../../../../utils/sendEmail";
import bcrypt from "bcryptjs";

// Helper function to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Generate OTP
    const otp = generateOTP();

    user.otp = otp;
    user.PasswordExpires = Date.now() + 10 * 60 * 1000; 
    await user.save();

    // Send OTP email
    const emailResponse = await sendOTPEmail(email,otp);

    if (!emailResponse.success) {
      return new Response(JSON.stringify({ error: "Failed to send OTP email" }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "OTP sent successfully to your email.",status: 200 }), { status: 200 });
  } catch (error) {
    console.error("Error during forgot password:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();

    const {resetOtp,password} = await req.json();

    if (!resetOtp || !password) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 8 characters" }),
        { status: 400 }
      );
    }

    // Find user by email
    const user = await UserModel.findOne({ otp:resetOtp });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    // Validate OTP and expiration
    if (user.otp !== resetOtp) {
      return new Response(
        JSON.stringify({ error: "Invalid OTP" }),
        { status: 400 }
      );
    }

    if (user.PasswordExpires < Date.now()) {
      return new Response(
        JSON.stringify({ error: "OTP has expired" }),
        { status: 400 }
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Update user's password and clear OTP fields
    user.password = hashPassword;
    user.otp = undefined; 
    user.PasswordExpires = undefined; 
    await user.save();

    return new Response(
      JSON.stringify({ message: "Password reset successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during password reset:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

