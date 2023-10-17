"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignOrderForDelivery = exports.onRequestOTP = exports.generateOtp = void 0;
const config_1 = require("../config/config");
const twilio_1 = __importDefault(require("twilio"));
const vandor_model_1 = require("../models/vandor.model");
const deliveryUser_model_1 = require("../models/deliveryUser.model");
const order_model_1 = require("../models/order.model");
// Email
// Notification
// OTP
const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + 10 * 60 * 1000);
    return { otp, expiry };
};
exports.generateOtp = generateOtp;
const onRequestOTP = (otp, toPhoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const client = (0, twilio_1.default)(config_1.ACCOUNT_SID, config_1.AUTH_TOKEN);
    const response = yield client.messages.create({
        body: `Your OTP is ${otp}`,
        from: config_1.PHONE_NUMBER,
        to: toPhoneNumber,
    });
    return response;
});
exports.onRequestOTP = onRequestOTP;
// Payment Notification or Email
// Delivery Notification
const assignOrderForDelivery = (orderId, vandorId) => __awaiter(void 0, void 0, void 0, function* () {
    // find the vandor
    const vandor = yield vandor_model_1.Vandor.findById(vandorId);
    if (vandor) {
        const areaCode = vandor.pincode;
        const vandorLat = vandor.lat;
        const vandorLng = vandor.lng;
        // find the available Delivery person
        const deliveryPerson = yield deliveryUser_model_1.DeliveryUser.find({
            pincode: areaCode,
            verified: true,
            isAvailable: true,
        });
        if (deliveryPerson) {
            // check the nearest person and assign the order
            console.log(`Delivery Person ${deliveryPerson[0]}`);
            const currentOrder = yield order_model_1.Order.findById(orderId);
            if (currentOrder) {
                // update delivery ID
                currentOrder.deliveryId = deliveryPerson[0]._id;
                const result = yield currentOrder.save();
                // Notify to vandor for received New Order using Firebase Push Notification
                console.log(result);
            }
        }
    }
});
exports.assignOrderForDelivery = assignOrderForDelivery;
//# sourceMappingURL=notification.js.map