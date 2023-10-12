import mongoose, { Schema, Document } from "mongoose";

export interface OfferDoc extends Document {
  offerType: string; // VANDOR // GENERIC
  vandors: [any]; // ['8934wornkweyr14']
  title: string; // INR 200 off on week days
  description: string; // Any description with Terms and Conditions
  minValue: number; // minimum order amount should be 300
  offerAmount: number; // 200
  startValidity: Date;
  endValidity: Date;
  promocode: string; // WEEK200
  promoType: string; // USER //ALL // BANK // CARD
  bank: [any];
  bins: [any];
  pincode: string;
  isActive: boolean;
}

const offerSchema = new Schema(
  {
    offerType: {
      type: String,
      require: true,
    },
    vandors: [
      {
        type: Schema.Types.ObjectId,
        ref: "vandor",
      },
    ],
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    minValue: {
      type: Number,
      require: true,
    },
    offerAmount: {
      type: String,
      require: true,
    },
    startValidity: {
      type: Date,
    },
    endValidity: {
      type: Date,
    },
    promocode: {
      type: String,
      require: true,
    },
    promoType: {
      type: String,
      require: true,
    },
    bank: [{ type: String }],
    bins: [{ type: Number }],
    pincode: {
      type: String,
      require: true,
    },
    isActive: {
      type: Boolean,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v, delete ret.createdAt, delete ret.updatedAt;
      },
    },

    timestamps: true,
  }
);

export const Offer = mongoose.model<OfferDoc>("offer", offerSchema);
