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
exports.verifyOffer = exports.getOrderById = exports.getOrders = exports.createOrder = exports.createPayment = exports.deleteCart = exports.getCart = exports.addToCart = exports.editProfile = exports.getProfile = exports.requestOtp = exports.userVerify = exports.login = exports.signup = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const user_dto_1 = require("../dto/user.dto");
const food_model_1 = require("../models/food.model");
const offer_model_1 = require("../models/offer.model");
const order_model_1 = require("../models/order.model");
const transaction_model_1 = require("../models/transaction.model");
const user_model_1 = require("../models/user.model");
const notification_1 = require("../utility/notification");
const password_1 = require("../utility/password");
const transaction_1 = require("../utility/transaction");
/** ------------------ Authentication Section ------------------ **/
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userInputs = (0, class_transformer_1.plainToClass)(user_dto_1.CreateUserInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(userInputs, {
        validationError: { target: true },
    });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, phone, password } = userInputs;
    const salt = yield (0, password_1.generateSalt)();
    const userPassword = yield (0, password_1.hashedPassword)(password, salt);
    const { otp, expiry } = (0, notification_1.generateOtp)();
    const existingUser = yield user_model_1.User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({
            message: "A user is already existed with this email",
        });
    }
    const result = yield user_model_1.User.create({
        email,
        password: userPassword,
        salt,
        phone,
        otp,
        otp_expiry: expiry,
        firstName: "Steve",
        lastName: "Roger",
        address: "Somewhere on earth",
        verified: false,
        lat: 0,
        lng: 0,
        orders: [],
    });
    if (result) {
        // send the otp to customer
        yield (0, notification_1.onRequestOTP)(otp, phone);
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
    res.status(401).json({
        message: "Error in Signup",
    });
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(user_dto_1.UserLoginInputs, req.body);
    const loginErrors = yield (0, class_validator_1.validate)(loginInputs, {
        validationError: { target: false },
    });
    if (loginErrors.length > 0) {
        return res.status(400).json(loginErrors);
    }
    const { email, password } = loginInputs;
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            message: "User Not Found Please Signup!",
        });
    }
    // check if entered password is correct
    const validation = yield (0, password_1.validatePassword)(password, user.password);
    if (validation) {
        // generate token
        const token = (0, password_1.generateToken)({
            _id: user._id,
            email: user.email,
            verified: user.verified,
        });
        // send the result to client
        return res.status(201).json({
            token,
            verified: user.verified,
            email: user.email,
        });
    }
    res.status(404).json({
        message: "Invalid Password",
    });
});
exports.login = login;
const userVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const user = req.user;
    if (user) {
        const profile = yield user_model_1.User.findById(user._id);
        if (profile) {
            // Check enter otp is right and entered before expire
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const result = yield profile.save();
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
        }
    }
    return res.status(400).json({
        message: "Error with OTP Validation",
    });
});
exports.userVerify = userVerify;
const requestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const profile = yield user_model_1.User.findById(user._id);
        if (profile) {
            const { otp, expiry } = (0, notification_1.generateOtp)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            yield (0, notification_1.onRequestOTP)(otp, profile.phone);
            return res.status(200).json({
                message: "OTP sent to your register phone number",
            });
        }
    }
    res.status(400).json({
        message: "Error with Request OTP",
    });
});
exports.requestOtp = requestOtp;
/** ------------------ Profile Section ------------------ **/
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const profile = yield user_model_1.User.findById(user._id);
        if (profile) {
            return res.status(200).json(profile);
        }
    }
    res.status(400).json({
        message: "Something went wrong, Try Again!",
    });
});
exports.getProfile = getProfile;
const editProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(user_dto_1.EditUserProfileInputs, req.body);
    const profileErrors = yield (0, class_validator_1.validate)(profileInputs, {
        validationError: { target: false },
    });
    if (profileErrors.length > 0) {
        return res.status(400).json(profileErrors);
    }
    const { firstName, lastName, address } = profileInputs;
    if (user) {
        const profile = yield user_model_1.User.findById(user._id);
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = yield profile.save();
            return res.status(200).json(result);
        }
    }
    res.status(400).json({
        message: "Something went wrong, Try Again!",
    });
});
exports.editProfile = editProfile;
/** ------------------ Cart Section ------------------ **/
const addToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const profile = yield user_model_1.User.findById(user._id).populate("cart.food");
        let cartItems = [];
        const { _id, unit } = req.body;
        const food = yield food_model_1.Food.findById(_id);
        if (profile && food) {
            // check for cart items
            cartItems = profile.cart;
            if (cartItems.length > 0) {
                // check and update units
                let existingItem = cartItems.filter((item) => item.food._id.toString() === _id);
                if (existingItem.length > 0) {
                    const index = cartItems.indexOf(existingItem[0]);
                    if (unit > 0) {
                        cartItems[index] = { food, unit };
                    }
                    else {
                        cartItems.splice(index, 1);
                    }
                }
                else {
                    cartItems.push({ food, unit });
                }
            }
            else {
                cartItems.push({ food, unit });
            }
            if (cartItems) {
                profile.cart = cartItems;
                const result = yield profile.save();
                return res.status(200).json(result.cart);
            }
        }
        return res.status(400).json({
            message: "Something went wrong, Try Again!",
        });
    }
});
exports.addToCart = addToCart;
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const profile = yield user_model_1.User.findById(user._id).populate("cart.food");
        if (profile) {
            return res.status(200).json(profile.cart);
        }
    }
    res.status(400).json({
        message: "Something went wrong, Try Again!",
    });
});
exports.getCart = getCart;
const deleteCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const profile = yield user_model_1.User.findById(user._id).populate("cart.food");
        if (profile) {
            profile.cart = [];
            yield profile.save();
            return res.status(200).json(profile.cart);
        }
    }
    res.status(400).json({
        message: "Something went wrong, Try Again!",
    });
});
exports.deleteCart = deleteCart;
/** -------------------- Payment Section ------------------- **/
const createPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { amount, paymentMode, offerId } = req.body;
    let payableAmount = Number(amount);
    if (offerId) {
        const offer = yield offer_model_1.Offer.findById(offerId);
        if (offer && offer.isActive) {
            payableAmount = payableAmount - offer.offerAmount;
        }
    }
    // Perform Payment gateway Charge API call
    // Create record on Transaction
    const transaction = yield transaction_model_1.Transaction.create({
        user: user._id,
        vandorId: "",
        orderId: "",
        orderValue: payableAmount,
        offerUsed: offerId || "NA",
        status: "OPEN",
        paymentMode: paymentMode,
        paymentResponse: "Payment is Cash on Delivery",
    });
    // return transaction ID
    return res.status(200).json(transaction);
});
exports.createPayment = createPayment;
/** ------------------ Order Section ------------------ **/
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // grab current login customer
    const user = req.user;
    const { transactionId, amount, items } = req.body;
    if (user) {
        // validate transaction
        const { status, transaction } = yield (0, transaction_1.validateTransaction)(transactionId);
        if (!status) {
            return res.status(404).json({
                message: "Error with Create Order",
            });
        }
        // create an order ID
        const orderId = `${Math.floor(100000 + Math.random() * 900000)}`;
        const profile = yield user_model_1.User.findById(user._id);
        let cartItems = [], netAmount = 0;
        let vandorId;
        // // Calculate order amount
        const foods = yield food_model_1.Food.find()
            .where("_id")
            .in(items.map((item) => item._id));
        foods.forEach((food) => {
            items.forEach(({ _id, unit }) => {
                if (food._id == _id) {
                    vandorId = food.vandorId;
                    netAmount += food.price * unit;
                    cartItems.push({ food, unit });
                }
            });
        });
        // Create order with item description
        if (cartItems) {
            // create Order
            const currentOrder = yield order_model_1.Order.create({
                orderID: orderId,
                vandorId: vandorId,
                items: cartItems,
                totalAmount: netAmount,
                paidAmount: amount,
                orderDate: new Date(),
                orderStatus: "Waiting",
                remarks: "",
                deliveryId: "",
                readyTime: 45,
            });
            // make cart empty
            profile.cart = [];
            // Finally update orders to user account
            profile.orders.push(currentOrder);
            yield profile.save();
            transaction.vandorId = vandorId;
            transaction.orderId = orderId;
            transaction.status = "CONFIRMED";
            yield transaction.save();
            (0, notification_1.assignOrderForDelivery)(currentOrder._id, vandorId);
            return res.status(200).json(currentOrder);
        }
    }
    res.status(400).json({
        message: "Error with Create Order",
    });
});
exports.createOrder = createOrder;
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const profile = yield user_model_1.User.findById(user._id).populate("orders");
        if (profile) {
            return res.status(200).json(profile.orders);
        }
    }
    res.status(400).json({
        message: "Something went wrong, Try Again!",
    });
});
exports.getOrders = getOrders;
const getOrderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    if (orderId) {
        const order = yield (yield order_model_1.Order.findById(orderId)).populate("items.food");
        return res.status(200).json(order);
    }
    res.status(400).json({
        message: "Something went wrong, Try Again!",
    });
});
exports.getOrderById = getOrderById;
/** ---------------------- Offer Section ------------------------- **/
const verifyOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const offerId = req.params.id;
    const user = req.user;
    if (user) {
        const appliedOffer = yield offer_model_1.Offer.findById(offerId);
        if (appliedOffer) {
            if (appliedOffer.promoType === "USER") {
                // Only can apply once per user
            }
            else {
                if (appliedOffer.isActive) {
                    return res.status(200).json({
                        message: "Offer is Valid",
                        offer: appliedOffer,
                    });
                }
            }
        }
    }
    res.status(404).json({
        message: "Offer Not Found!",
    });
});
exports.verifyOffer = verifyOffer;
//# sourceMappingURL=userController.js.map