import mongoose, { Schema, Document } from "mongoose";

interface vandorDoc extends Document {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable: boolean;
  coverImages: [string];
  rating: number;
  foods: any;
}

const vandorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    foodType: {
      type: [String],
    },
    pincode: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
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
    serviceAvailable: {
      type: Boolean,
    },
    coverImages: {
      type: [String],
    },
    rating: {
      type: Number,
    },
    foods: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
      },
    ],
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

export const Vandor = mongoose.model<vandorDoc>("vandor", vandorSchema);