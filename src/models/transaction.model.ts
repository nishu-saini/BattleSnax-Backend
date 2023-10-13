import mongoose, { Schema, Document } from "mongoose";

export interface TransactionDoc extends Document {
  user: string;
  vandorId: string;
  orderId: string;
  orderValue: number;
  offerUsed: string;
  status: string;
  paymentMode: string;
  paymentResponse: string;
}

const transactionSchema = new Schema(
  {
    user: { type: String },
    vandorId: { type: String },
    orderId: { type: String },
    orderValue: { type: Number },
    offerUsed: { type: String },
    status: { type: String },
    paymentMode: { type: String },
    paymentResponse: { type: String },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },

    timestamps: true,
  }
);

export const Transaction = mongoose.model<TransactionDoc>(
  "transaction",
  transactionSchema
);
