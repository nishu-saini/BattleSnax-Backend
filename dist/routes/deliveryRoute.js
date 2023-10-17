"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deliveryController_1 = require("../controllers/deliveryController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
/** -------------------- User Athenctication ------------------------- **/
router.post("/signup", deliveryController_1.deliveryUserSignUp);
router.post("/login", deliveryController_1.deliveryUserLogin);
/** ------------------------ Change Service Status --------------------- **/
router.put("/change-status", auth_1.isAuthenticated, deliveryController_1.updateDeliveryUserStatus);
/** ------------------------------- profile ---------------------------- **/
router
    .route("/profile")
    .get(auth_1.isAuthenticated, deliveryController_1.getDeliveryUserProfile)
    .patch(auth_1.isAuthenticated, deliveryController_1.editDeliveryUserProfile);
exports.default = router;
//# sourceMappingURL=deliveryRoute.js.map