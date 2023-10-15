import { ACCOUNT_SID, AUTH_TOKEN, PHONE_NUMBER } from "../config/config";
import twilio from "twilio";
import { Vandor } from "../models/vandor.model";
import { DeliveryUser } from "../models/deliveryUser.model";
import { Order } from "../models/order.model";

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
  const vandor = await Vandor.findById(vandorId);

  if (vandor) {
    const areaCode = vandor.pincode;
    const vandorLat = vandor.lat;
    const vandorLng = vandor.lng;

    // find the available Delivery person
    const deliveryPerson = await DeliveryUser.find({
      pincode: areaCode,
      verified: true,
      isAvailable: true,
    });

    if (deliveryPerson) {
      // check the nearest person and assign the order
      console.log(`Delivery Person ${deliveryPerson[0]}`);

      const currentOrder = await Order.findById(orderId);

      if (currentOrder) {
        // update delivery ID
        currentOrder.deliveryId = deliveryPerson[0]._id;
        const result = await currentOrder.save();

        // Notify to vandor for received New Order using Firebase Push Notification
        console.log(result);
      }
    }
  }
};
