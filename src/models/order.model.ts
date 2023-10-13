import mongoose, { Schema, Document } from "mongoose";

export interface OrderDoc extends Document {
  orderID: string;
  vandorId: string;
  items: [any];
  totalAmount: number;
  paidAmount: number;
  orderDate: Date;
  orderStatus: string;
  remarks: string;
  deliveryId: string;
  readyTime: number; // max 60 minutes
}

const orderSchema = new Schema(
  {
    orderID: {
      type: String,
      required: true,
    },
    vandorId: {
      type: String,
      require: true,
    },
    items: [
      {
        food: {
          type: Schema.Types.ObjectId,
          ref: "food",
          required: true,
        },
        unit: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      require: true,
    },
    orderDate: {
      type: Date,
    },
    orderStatus: {
      type: String,
    },
    remarks: {
      type: String,
    },
    deliveryId: {
      type: String,
    },
    readyTime: {
      type: Number,
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

export const Order = mongoose.model<OrderDoc>("order", orderSchema);
