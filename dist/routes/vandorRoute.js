"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vandorController_1 = require("../controllers/vandorController");
const auth_1 = require("../middlewares/auth");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + "_" + file.originalname);
    },
});
const images = (0, multer_1.default)({ storage: imageStorage }).array("images", 10);
router.get("/", (req, res, next) => {
    res.json({
        message: "Vandor Route",
    });
});
/** --------------- Vandor Authentication --------------- **/
router.post("/login", vandorController_1.login);
/** --------------- Vandor Profile ------------------- **/
router
    .route("/profile")
    .get(auth_1.isAuthenticated, vandorController_1.getVandorProfile)
    .patch(auth_1.isAuthenticated, vandorController_1.updateVandorProfile);
router
    .route("/coverimage")
    .patch(auth_1.isAuthenticated, images, vandorController_1.updateVandorCoverProfile);
/** --------------- Vandor Services ------------------- **/
router.route("/service").patch(auth_1.isAuthenticated, vandorController_1.updateVandorService);
router.route("/food").post(auth_1.isAuthenticated, images, vandorController_1.addFood);
router.route("/foods").get(auth_1.isAuthenticated, vandorController_1.getFoods);
/** --------------- Orders ------------------- **/
router.get("/orders", auth_1.isAuthenticated, vandorController_1.getCurrentOrders);
router.get("/order/:id", auth_1.isAuthenticated, vandorController_1.getOrderDetails);
router.put("/order/:id/process", auth_1.isAuthenticated, vandorController_1.processOrder);
/** --------------- Offers ------------------- **/
router.get("/offers", auth_1.isAuthenticated, vandorController_1.getOffers);
router.post("/offer", auth_1.isAuthenticated, vandorController_1.addOffer);
router.put("/offer/:id", auth_1.isAuthenticated, vandorController_1.editOffer);
exports.default = router;
//# sourceMappingURL=vandorRoute.js.map