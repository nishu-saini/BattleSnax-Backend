import mongoose, { Schema, Document } from "mongoose";

interface userDoc extends Document {
  email: string;
  password: string;
  salt: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  verified: boolean;
  otp: number;
  otp_expiry: Date;
  lat: number;
  lng: number;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    verified: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    otp_expiry: {
      type: Date,
      required: true,
    },
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
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

export const User = mongoose.model<userDoc>("user", userSchema);
