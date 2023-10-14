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

// Delivery Notification
export const assignOrderForDelivery = async (
  orderId: string,
  vandorId: string
) => {
  // find the vandor
  // find the available Delivery person
  // check the nearest person and assign the order
  // update delivery ID
};
