import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
        user: process.env.EMAIL_FROM, 
        pass: process.env.EMAIL_PASS, 
    },
});

export async function sendVerificationEmail(to, username, verificationUrl) {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject: "Verification Link",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #4caf50; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to Our Platform!</h1>
          </div>
          <div style="padding: 20px; color: #333;">
            <p style="font-size: 16px;">Hi <strong>${username}</strong>,</p>
            <p style="font-size: 16px; line-height: 1.5;">
              We're excited to have you on board! Please verify your email address to activate your account and get started.
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a 
                href="${verificationUrl}" 
                style="
                  display: inline-block;
                  background-color: #4caf50;
                  color: white;
                  padding: 10px 20px;
                  text-decoration: none;
                  font-size: 16px;
                  border-radius: 5px;
                "
                target="_blank"
              >
                Verify Email
              </a>
            </div>
            <p style="font-size: 14px; color: #555; line-height: 1.5;">
              If the button above doesn't work, please copy and paste the following link into your browser:
            </p>
            <p style="font-size: 14px; word-break: break-word; color: #4caf50;">
              <a href="${verificationUrl}" target="_blank" style="text-decoration: none; color: #4caf50;">${verificationUrl}</a>
            </p>
            <p style="font-size: 14px; line-height: 1.5; color: #777;">
              If you didn't sign up for our platform, you can safely ignore this email.
            </p>
          </div>
          <div style="background-color: #f9f9f9; color: #888; text-align: center; padding: 10px;">
            <p style="font-size: 12px; margin: 0;">&copy; 2024 Our Platform. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
}

export async function sendOTPEmail(to, otp) {
  const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: "Your OTP for Password Reset",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #4caf50; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Password Reset Request</h1>
        </div>
        <div style="padding: 20px; color: #333;">
          <p style="font-size: 16px;">Hi,</p>
          <p style="font-size: 16px; line-height: 1.5;">
            You recently requested to reset your password. Use the following OTP to proceed with resetting your password:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span 
              style="
                display: inline-block;
                background-color: #4caf50;
                color: white;
                padding: 10px 20px;
                font-size: 20px;
                font-weight: bold;
                border-radius: 5px;
              "
            >
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #555; line-height: 1.5;">
            This OTP is valid for 10 minutes. If you did not request this, please ignore this email.
          </p>
        </div>
        <div style="background-color: #f9f9f9; color: #888; text-align: center; padding: 10px;">
          <p style="font-size: 12px; margin: 0;">&copy; 2024 Our Platform. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
      await transporter.sendMail(mailOptions);
      return { success: true };
  } catch (error) {
      console.error("Error sending OTP email:", error);
      return { success: false, error };
  }
}
