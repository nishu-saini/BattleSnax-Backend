"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
/** ---------------------- User Athenctication --------------------- **/
router.post("/signup", userController_1.signup);
router.post("/login", userController_1.login);
router.patch("/verify", auth_1.isAuthenticated, userController_1.userVerify);
router.get("/otp", auth_1.isAuthenticated, userController_1.requestOtp);
/** ------------------------- Profile ---------------------------- **/
router
    .route("/profile")
    .get(auth_1.isAuthenticated, userController_1.getProfile)
    .patch(auth_1.isAuthenticated, userController_1.editProfile);
/** ----------------------------- Cart -------------------------- **/
router
    .route("/cart")
    .post(auth_1.isAuthenticated, userController_1.addToCart)
    .get(auth_1.isAuthenticated, userController_1.getCart)
    .delete(auth_1.isAuthenticated, userController_1.deleteCart);
/** -------------------------- Apply Offers --------------------- **/
router.get("/offer/verify/:id", auth_1.isAuthenticated, userController_1.verifyOffer);
/** --------------------------- Order --------------------------- **/
router.post("/create-order", auth_1.isAuthenticated, userController_1.createOrder);
router.get("/orders", auth_1.isAuthenticated, userController_1.getOrders);
router.get("/order/:id", auth_1.isAuthenticated, userController_1.getOrderById);
/** -------------------------- Payment -------------------------- **/
router.post("/create-payment", auth_1.isAuthenticated, userController_1.createPayment);
exports.default = router;
//# sourceMappingURL=userRoute.js.map