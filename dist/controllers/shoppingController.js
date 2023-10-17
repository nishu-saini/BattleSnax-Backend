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
exports.getAvailableOffers = exports.restaurantById = exports.searchFoods = exports.getFoodIn30Min = exports.getTopRestaurants = exports.getFoodAvailability = void 0;
const offer_model_1 = require("../models/offer.model");
const vandor_model_1 = require("../models/vandor.model");
const getFoodAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    const result = yield vandor_model_1.Vandor.find({ pincode, serviceAvailable: true })
        .sort([["rating", "descending"]])
        .populate("foods");
    if (result.length == 0) {
        return res.status(400).json({
            message: "Data Not Found",
        });
    }
    res.status(200).json(result);
});
exports.getFoodAvailability = getFoodAvailability;
const getTopRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    const result = yield vandor_model_1.Vandor.find({ pincode, serviceAvailable: true })
        .sort([["rating", "descending"]])
        .limit(10);
    if (result.length == 0) {
        return res.status(400).json({
            message: "Data Not Found",
        });
    }
    res.status(200).json(result);
});
exports.getTopRestaurants = getTopRestaurants;
const getFoodIn30Min = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    const result = yield vandor_model_1.Vandor.find({
        pincode,
        serviceAvailable: true,
    }).populate("foods");
    if (result.length == 0) {
        return res.status(400).json({
            message: "Data Not Found",
        });
    }
    // find foods in vandor
    let foodResult = [];
    result.forEach((vandor) => {
        const foods = vandor.foods;
        foodResult.push(...foods.filter((food) => food.readyTime <= 30));
    });
    res.status(200).json(foodResult);
});
exports.getFoodIn30Min = getFoodIn30Min;
const searchFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode } = req.params;
    const result = yield vandor_model_1.Vandor.find({
        pincode,
        serviceAvailable: true,
    }).populate("foods");
    if (result.length == 0) {
        return res.status(400).json({
            message: "Data Not Found",
        });
    }
    // find foods in vandor
    let foodResult = [];
    result.forEach((vandor) => {
        foodResult.push(...vandor.foods);
    });
    res.status(200).json(foodResult);
});
exports.searchFoods = searchFoods;
const restaurantById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const vandor = yield vandor_model_1.Vandor.findById(id).populate("foods");
    if (!vandor) {
        return res.status(400).json({
            message: "Restaurant Not Found",
        });
    }
    res.status(400).json(vandor);
});
exports.restaurantById = restaurantById;
const getAvailableOffers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const offers = yield offer_model_1.Offer.find({ pincode, isActive: true });
    if (offers) {
        return res.status(200).json(offers);
    }
    res.status(400).json({
        message: "Offer Not Found!",
    });
});
exports.getAvailableOffers = getAvailableOffers;
//# sourceMappingURL=shoppingController.js.map