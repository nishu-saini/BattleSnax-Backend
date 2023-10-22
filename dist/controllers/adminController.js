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
exports.getDeliveryUserById = exports.getDeliveryUsers = exports.verifyDeliveryUser = exports.getTransactionById = exports.getTransactions = exports.getVandorByID = exports.getVandors = exports.createVandor = void 0;
const error_1 = __importDefault(require("../middlewares/error"));
const deliveryUser_model_1 = require("../models/deliveryUser.model");
const transaction_model_1 = require("../models/transaction.model");
const vandor_model_1 = require("../models/vandor.model");
const password_1 = require("../utility/password");
const vandor_1 = require("../utility/vandor");
const createVandor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address, pincode, foodType, email, password, ownerName, phone, } = req.body;
        const existingVandor = yield (0, vandor_1.findVandor)("", email);
        if (existingVandor) {
            return next(new error_1.default("Vandor Already Exist", 409));
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
        res.status(200).json(vandor);
    }
    catch (error) {
        next(error);
    }
});
exports.createVandor = createVandor;
const getVandors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vandors = yield vandor_model_1.Vandor.find();
        if (vandors) {
            return res.status(200).json(vandors);
        }
        return next(new error_1.default("Data Not Available", 400));
    }
    catch (error) {
        next(error);
    }
});
exports.getVandors = getVandors;
const getVandorByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vandorId = req.params.id;
        const vandor = yield (0, vandor_1.findVandor)(vandorId);
        if (vandor) {
            return res.status(200).json(vandor);
        }
        return next(new error_1.default("Vandor Not Found", 404));
    }
    catch (error) {
        next(error);
    }
});
exports.getVandorByID = getVandorByID;
/** --------------------- Transaction Section -------------------- **/
const getTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield transaction_model_1.Transaction.find();
        if (transactions) {
            return res.status(200).json(transactions);
        }
        return next(new error_1.default("Transaction Not Found", 404));
    }
    catch (error) {
        next(error);
    }
});
exports.getTransactions = getTransactions;
const getTransactionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const transaction = yield transaction_model_1.Transaction.findById(id);
        if (transaction) {
            return res.status(200).json(transaction);
        }
        return next(new error_1.default("Transaction Not Found", 404));
    }
    catch (error) {
        next(error);
    }
});
exports.getTransactionById = getTransactionById;
const verifyDeliveryUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, status } = req.body;
        if (_id) {
            const profile = yield deliveryUser_model_1.DeliveryUser.findById(_id);
            if (profile) {
                profile.verified = status;
                const result = yield profile.save();
                return res.status(200).json(result);
            }
        }
        return next(new error_1.default("Unable to verify Delivery User", 400));
    }
    catch (error) {
        next(error);
    }
});
exports.verifyDeliveryUser = verifyDeliveryUser;
const getDeliveryUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryUsers = yield deliveryUser_model_1.DeliveryUser.find();
        if (deliveryUsers) {
            return res.status(200).json(deliveryUsers);
        }
        return next(new error_1.default("Delivery User Not Found!", 404));
    }
    catch (error) {
        next(error);
    }
});
exports.getDeliveryUsers = getDeliveryUsers;
const getDeliveryUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const deliveryUser = yield deliveryUser_model_1.DeliveryUser.findById(id);
        if (deliveryUser) {
            return res.status(200).json(deliveryUser);
        }
        return next(new error_1.default("Delivery User Not Found!", 404));
    }
    catch (error) {
        next(error);
    }
});
exports.getDeliveryUserById = getDeliveryUserById;
//# sourceMappingURL=adminController.js.map