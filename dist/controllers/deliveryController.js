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
exports.updateDeliveryUserStatus = exports.editDeliveryUserProfile = exports.getDeliveryUserProfile = exports.deliveryUserLogin = exports.deliveryUserSignUp = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const user_dto_1 = require("../dto/user.dto");
const error_1 = __importDefault(require("../middlewares/error"));
const deliveryUser_model_1 = require("../models/deliveryUser.model");
const password_1 = require("../utility/password");
/** ------------------ Authentication Section ------------------ **/
const deliveryUserSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryUserInputs = (0, class_transformer_1.plainToClass)(user_dto_1.CreateDeliveryUserInputs, req.body);
        const inputErrors = yield (0, class_validator_1.validate)(deliveryUserInputs, {
            validationError: { target: true },
        });
        if (inputErrors.length > 0) {
            return res.status(400).json(inputErrors);
        }
        const { email, phone, password, address, firstName, lastName, pincode } = deliveryUserInputs;
        const salt = yield (0, password_1.generateSalt)();
        const userPassword = yield (0, password_1.hashedPassword)(password, salt);
        const existingDeliveryUser = yield deliveryUser_model_1.DeliveryUser.findOne({ email });
        if (existingDeliveryUser) {
            return next(new error_1.default("A Delivery User is already existed with this email", 409));
        }
        const result = yield deliveryUser_model_1.DeliveryUser.create({
            email,
            password: userPassword,
            salt,
            phone,
            firstName,
            lastName,
            pincode,
            address,
            verified: false,
            lat: 0,
            lng: 0,
            isAvailable: false,
        });
        if (result) {
            // generate token
            const token = (0, password_1.generateToken)({
                _id: result._id,
                email: result.email,
                verified: result.verified,
            });
            // send the result to client
            return res.status(201).json({
                token,
                verified: result.verified,
                email: result.email,
            });
        }
        return next(new error_1.default("Error in Signup", 400));
    }
    catch (error) {
        next(error);
    }
});
exports.deliveryUserSignUp = deliveryUserSignUp;
const deliveryUserLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginInputs = (0, class_transformer_1.plainToClass)(user_dto_1.UserLoginInputs, req.body);
        const loginErrors = yield (0, class_validator_1.validate)(loginInputs, {
            validationError: { target: false },
        });
        if (loginErrors.length > 0) {
            return res.status(400).json(loginErrors);
        }
        const { email, password } = loginInputs;
        const deliveryUser = yield deliveryUser_model_1.DeliveryUser.findOne({ email });
        if (!deliveryUser) {
            return next(new error_1.default("User Not Found Please Signup", 404));
        }
        // check if entered password is correct
        const validation = yield (0, password_1.validatePassword)(password, deliveryUser.password);
        if (validation) {
            // generate token
            const token = (0, password_1.generateToken)({
                _id: deliveryUser._id,
                email: deliveryUser.email,
                verified: deliveryUser.verified,
            });
            // send the result to client
            return res.status(201).json({
                token,
                verified: deliveryUser.verified,
                email: deliveryUser.email,
            });
        }
        return next(new error_1.default("Invalid Password", 400));
    }
    catch (error) {
        next(error);
    }
});
exports.deliveryUserLogin = deliveryUserLogin;
/** ------------------ Profile Section ------------------ **/
const getDeliveryUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryUser = req.user;
        if (deliveryUser) {
            const profile = yield deliveryUser_model_1.DeliveryUser.findById(deliveryUser._id);
            if (profile) {
                return res.status(200).json(profile);
            }
        }
        return next(new error_1.default("Something went wrong, Try Again!", 400));
    }
    catch (error) {
        next(error);
    }
});
exports.getDeliveryUserProfile = getDeliveryUserProfile;
const editDeliveryUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryUser = req.user;
        const profileInputs = (0, class_transformer_1.plainToClass)(user_dto_1.EditUserProfileInputs, req.body);
        const profileErrors = yield (0, class_validator_1.validate)(profileInputs, {
            validationError: { target: false },
        });
        if (profileErrors.length > 0) {
            return res.status(400).json(profileErrors);
        }
        const { firstName, lastName, address } = profileInputs;
        if (deliveryUser) {
            const profile = yield deliveryUser_model_1.DeliveryUser.findById(deliveryUser._id);
            if (profile) {
                profile.firstName = firstName;
                profile.lastName = lastName;
                profile.address = address;
                const result = yield profile.save();
                return res.status(200).json(result);
            }
        }
        return next(new error_1.default("Something went wrong, Try Again!", 400));
    }
    catch (error) {
        next(error);
    }
});
exports.editDeliveryUserProfile = editDeliveryUserProfile;
const updateDeliveryUserStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryUser = req.user;
        if (deliveryUser) {
            const { lat, lng } = req.body;
            const profile = yield deliveryUser_model_1.DeliveryUser.findById(deliveryUser._id);
            if (profile) {
                if (lat && lng) {
                    profile.lat = lat;
                    profile.lng = lng;
                }
                profile.isAvailable = !profile.isAvailable;
                const result = yield profile.save();
                return res.status(201).json(result);
            }
        }
        return next(new error_1.default("Error with Update Status", 400));
    }
    catch (error) {
        next(error);
    }
});
exports.updateDeliveryUserStatus = updateDeliveryUserStatus;
//# sourceMappingURL=deliveryController.js.map