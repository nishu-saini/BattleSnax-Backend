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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeliveryUserById = exports.getDeliveryUsers = exports.verifyDeliveryUser = exports.getTransactionById = exports.getTransactions = exports.getVandorByID = exports.getVandors = exports.createVandor = void 0;
const deliveryUser_model_1 = require("../models/deliveryUser.model");
const transaction_model_1 = require("../models/transaction.model");
const vandor_model_1 = require("../models/vandor.model");
const password_1 = require("../utility/password");
const vandor_1 = require("../utility/vandor");
const createVandor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, pincode, foodType, email, password, ownerName, phone, } = req.body;
    const existingVandor = yield (0, vandor_1.findVandor)("", email);
    if (existingVandor) {
        return res.status(409).json({
            message: "A vandor is already existed with this email ID",
        });
    }
    // generate salt
    const salt = yield (0, password_1.generateSalt)();
    const userPassword = yield (0, password_1.hashedPassword)(password, salt);
    const vandor = yield vandor_model_1.Vandor.create({
        name,
        address,
        pincode,
        foodType,
        email,
        password: userPassword,
        salt: salt,
        ownerName,
        phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
        foods: [],
        lat: 0,
        lng: 0,
    });
    res.status(200).json({
        vandor,
    });
});
exports.createVandor = createVandor;
const getVandors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandors = yield vandor_model_1.Vandor.find();
    if (vandors) {
        return res.status(200).json(vandors);
    }
    return res.status(400).json({
        message: "vandors data not available",
    });
});
exports.getVandors = getVandors;
const getVandorByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandorId = req.params.id;
    const vandor = yield (0, vandor_1.findVandor)(vandorId);
    if (vandor) {
        return res.status(200).json(vandor);
    }
    return res.status(404).json({
        message: "vandor not found",
    });
});
exports.getVandorByID = getVandorByID;
/** --------------------- Transaction Section -------------------- **/
const getTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transaction.find();
    if (transactions) {
        return res.status(200).json(transactions);
    }
    return res.status(404).json({
        message: "Transaction not Found!",
    });
});
exports.getTransactions = getTransactions;
const getTransactionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const transaction = yield transaction_model_1.Transaction.findById(id);
    if (transaction) {
        return res.status(200).json(transaction);
    }
    return res.status(404).json({
        message: "Transaction not Found!",
    });
});
exports.getTransactionById = getTransactionById;
const verifyDeliveryUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, status } = req.body;
    if (_id) {
        const profile = yield deliveryUser_model_1.DeliveryUser.findById(_id);
        if (profile) {
            profile.verified = status;
            const result = yield profile.save();
            return res.status(200).json(result);
        }
    }
    return res.status(400).json({
        message: "Unable to verify Delivery User",
    });
});
exports.verifyDeliveryUser = verifyDeliveryUser;
const getDeliveryUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const deliveryUsers = yield deliveryUser_model_1.DeliveryUser.find();
    if (deliveryUsers) {
        return res.status(200).json(deliveryUsers);
    }
    return res.status(400).json({
        message: "Delivery User Not Found!",
    });
});
exports.getDeliveryUsers = getDeliveryUsers;
const getDeliveryUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const deliveryUser = yield deliveryUser_model_1.DeliveryUser.findById(id);
    if (deliveryUser) {
        return res.status(200).json(deliveryUser);
    }
    return res.status(400).json({
        message: "Delivery User Not Found!",
    });
});
exports.getDeliveryUserById = getDeliveryUserById;
//# sourceMappingURL=adminController.js.map