import { ACCOUNT_SID, AUTH_TOKEN, PHONE_NUMBER } from "../config/config";
import twilio from "twilio";

// Email

// Notification

// OTP
export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);

  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 10 * 60 * 1000);

  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: PHONE_NUMBER,
    to: toPhoneNumber,
  });

  return response;
};

// Payment Notification or Email
