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
exports.editOffer = exports.addOffer = exports.getOffers = exports.processOrder = exports.getOrderDetails = exports.getCurrentOrders = exports.getFoods = exports.addFood = exports.updateVandorService = exports.updateVandorCoverProfile = exports.updateVandorProfile = exports.getVandorProfile = exports.login = void 0;
const error_1 = __importDefault(require("../middlewares/error"));
const food_model_1 = require("../models/food.model");
const offer_model_1 = require("../models/offer.model");
const order_model_1 = require("../models/order.model");
const password_1 = require("../utility/password");
const vandor_1 = require("../utility/vandor");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const vandor = yield (0, vandor_1.findVandor)("", email);
        if (vandor) {
            const validation = yield (0, password_1.validatePassword)(password, vandor.password);
            if (validation) {
                const jwt_token = (0, password_1.generateToken)({
                    _id: vandor.id,
                    email: vandor.email,
                    foodType: vandor.foodType,
                    name: vandor.name,
                });
                return res.status(201).json({
                    token: jwt_token,
                });
            }
            return next(new error_1.default("Password is not valid", 400));
        }
        return next(new error_1.default("Login credentials not valid", 400));
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const getVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user) {
            const vandor = yield (0, vandor_1.findVandor)(user._id);
            return res.status(200).json(vandor);
        }
        return next(new error_1.default("Vandor information Not Found", 404));
    }
    catch (error) {
        next(error);
    }
});
exports.getVandorProfile = getVandorProfile;
const updateVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { foodType, name, address, phone } = req.body;
        const user = req.user;
        if (user) {
            const vandor = yield (0, vandor_1.findVandor)(user._id);
            if (vandor) {
                vandor.name = name;
                vandor.address = address;
                vandor.phone = phone;
                vandor.foodType = foodType;
                const savedResult = yield vandor.save();
                return res.status(200).json(savedResult);
            }
        }
        return next(new error_1.default("Vandor information Not Found", 404));
    }
    catch (error) {
        next(error);
    }
});
exports.updateVandorProfile = updateVandorProfile;
const updateVandorCoverProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user) {
            // Upload Image to Cloudnary
        }
        return next(new error_1.default("Something went wrong while updating cover image", 400));
    }
    catch (error) {
        next(error);
    }
});
exports.updateVandorCoverProfile = updateVandorCoverProfile;
const updateVandorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { lat, lng } = req.body;
        if (user) {
            const vandor = yield (0, vandor_1.findVandor)(user._id);
            if (vandor) {
                vandor.serviceAvailable = !vandor.serviceAvailable;
                if (lat && lng) {
                    vandor.lat = lat;
                    vandor.lng = lng;
                }
                const savedResult = yield vandor.save();
                return res.status(200).json(savedResult);
            }
        }
        return next(new error_1.default("Vandor information not found", 404));
    }
    catch (error) {
        next(error);
    }
});
exports.updateVandorService = updateVandorService;
const addFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user) {
            const { name, description, category, foodType, readyTime, price } = req.body;
            const vandor = yield (0, vandor_1.findVandor)(user._id);
            if (vandor) {
                const files = req.files;
                const images = files.map((file) => file.filename);
                const createFood = yield food_model_1.Food.create({
                    vandorId: vandor._id,
                    name,
                    description,
                    category,
                    foodType,
                    images,
                    readyTime,
                    price,
                    rating: 0,
                });
                vandor.foods.push(createFood);
                const result = yield vandor.save();
                return res.status(200).json(result);
            }
        }
        return next(new error_1.default("Some went wrong with add food", 400));
    }
    catch (error) {
        next(error);
    }
});
exports.addFood = addFood;
const getFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user) {
            const foods = yield food_model_1.Food.find({ vandorId: user._id });
            if (!foods) {
                return next(new error_1.default("Food information not found", 400));
            }
            res.status(200).json(foods);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getFoods = getFoods;
const getCurrentOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user) {
            const orders = yield order_model_1.Order.find({ vandorId: user._id }).populate("items.food");
            if (orders) {
                return res.status(200).json(orders);
            }
        }
        return next(new error_1.default("Order not found", 404));
    }
    catch (error) {
        next(error);
    }
});
exports.getCurrentOrders = getCurrentOrders;
const getOrderDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        if (orderId) {
            const order = yield order_model_1.Order.findById(orderId).populate("items.food");
            if (order) {
                return res.status(200).json(order);
            }
        }
        return next(new error_1.default("Order not found", 404));
    }
    catch (error) {
        next(error);
    }
});
exports.getOrderDetails = getOrderDetails;
const processOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        const { status, remarks, time } = req.body;
        const order = yield order_model_1.Order.findById(orderId).populate("items.food");
        if (order) {
            order.orderStatus = status;
            order.remarks = remarks;
            if (time) {
                order.readyTime = time;
            }
            const result = yield order.save();
            return res.status(200).json(result);
        }
        return next(new error_1.default("Order not found", 404));
    }
    catch (error) {
        next(error);
    }
});
exports.processOrder = processOrder;
/** ---------------------- Offer Section ------------------------- **/
const getOffers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user) {
            let currentOffers = [];
            const offers = yield offer_model_1.Offer.find().populate("vandors");
            if (offers) {
                offers.forEach((offer) => {
                    // if vandor available..
                    if (offer.vandors) {
                        offer.vandors.forEach((vandor) => {
                            if (vandor._id.toString() === user._id) {
                                currentOffers.push(offer);
                            }
                        });
                    }
                    // GENERIC Offer
                    else if (offer.offerType === "GENERIC") {
                        currentOffers.push(offer);
                    }
                });
                return res.status(200).json(currentOffers);
            }
        }
        return next(new error_1.default("Offer not found", 404));
    }
    catch (error) {
        next(error);
    }
});
exports.getOffers = getOffers;
const addOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user) {
            const { title, description, offerType, offerAmount, pincode, promocode, promoType, startValidity, endValidity, bank, bins, minValue, isActive, } = req.body;
            const vandor = yield (0, vandor_1.findVandor)(user._id);
            if (vandor) {
                const offer = yield offer_model_1.Offer.create({
                    title,
                    description,
                    offerType,
                    offerAmount,
                    pincode,
                    promocode,
                    promoType,
                    startValidity,
                    endValidity,
                    bank,
                    bins,
                    isActive,
                    minValue,
                    vandors: [vandor],
                });
                return res.status(200).json(offer);
            }
        }
        return next(new error_1.default("Unable to add Offer", 400));
    }
    catch (error) {
        next(error);
    }
});
exports.addOffer = addOffer;
const editOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const offerId = req.params.id;
        if (user) {
            const { title, description, offerType, offerAmount, pincode, promocode, promoType, startValidity, endValidity, bank, bins, minValue, isActive, } = req.body;
            const offer = yield offer_model_1.Offer.findById(offerId);
            if (offer) {
                const vandor = yield (0, vandor_1.findVandor)(user._id);
                if (vandor) {
                    // update offer
                    (offer.title = title), (offer.description = description);
                    offer.offerType = offerType;
                    offer.offerAmount = offerAmount;
                    offer.pincode = pincode;
                    offer.promocode = promocode;
                    offer.promoType = promoType;
                    offer.startValidity = startValidity;
                    offer.endValidity = endValidity;
                    offer.bank = bank;
                    offer.bins = bins;
                    offer.minValue = minValue;
                    offer.isActive = isActive;
                    const result = yield offer.save();
                    return res.status(200).json(result);
                }
            }
        }
        return next(new error_1.default("Offer not found", 404));
    }
    catch (error) {
        next(error);
    }
});
exports.editOffer = editOffer;
//# sourceMappingURL=vandorController.js.map