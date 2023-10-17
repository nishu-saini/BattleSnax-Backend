"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const orderSchema = new mongoose_1.Schema({
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
                type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v, delete ret.createdAt, delete ret.updatedAt;
        },
    },
    timestamps: true,
});
exports.Order = mongoose_1.default.model("order", orderSchema);
//# sourceMappingURL=order.model.js.map