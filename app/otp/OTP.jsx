"use client";
import React, { useRef, useState } from "react";

const OTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const otpRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return; // Ensure only numeric input
    let updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Move focus to the next input if available
    if (value && index < otp.length - 1) {
      otpRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRef.current[index - 1]?.focus();
    }
  };

  return (
    <div>
      {otp.map((_, index) => (
        <input
          type="text"
          name="otp"
          maxLength="1"
          key={index}
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(n) => (otpRef.current[index] = n)}
          className="otp-input"
        />
      ))}
    </div>
  );
};

export default OTP;
