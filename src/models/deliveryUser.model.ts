import mongoose, { Schema, Document } from "mongoose";
import { OrderDoc } from "./order.model";

interface deliveryUserDoc extends Document {
  email: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  address: string;
  pincode: string;
  phone: string;
  verified: boolean;
  lat: number;
  lng: number;
  isAvailable: boolean;
}

const deliveryUserSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    pincode: { type: String },
    phone: { type: String, required: true },
    verified: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
    isAvailable: { type: Boolean },
  },
  {
    // delete unneccessary property from sending to client side
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

export const DeliveryUser = mongoose.model<deliveryUserDoc>(
  "delivery_user",
  deliveryUserSchema
);
