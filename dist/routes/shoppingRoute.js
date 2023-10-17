"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shoppingController_1 = require("../controllers/shoppingController");
const router = express_1.default.Router();
/** -------------------------- Food Availablity ------------------ **/
router.get("/:pincode", shoppingController_1.getFoodAvailability);
/** ---------------------- Top Restaurants ------------------- **/
router.get("/top-restaurants/:pincode", shoppingController_1.getTopRestaurants);
/** ------------------ Foods available in 30 Minutes ----------- **/
router.get("/foods-in-30-min/:pincode", shoppingController_1.getFoodIn30Min);
/** ------------------------- Search Foods ------------------------ **/
router.get("/search/:pincode", shoppingController_1.searchFoods);
/** ------------------------- Find Offers ------------------------- **/
router.get("/offers/:pincode", shoppingController_1.getAvailableOffers);
/** ----------------------- Find Restaurant by ID ---------------- **/
router.get("/restaurant/:id", shoppingController_1.restaurantById);
exports.default = router;
//# sourceMappingURL=shoppingRoute.js.map