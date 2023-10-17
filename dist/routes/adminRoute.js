"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
router.get("/", (req, res, next) => {
    res.json({
        message: "Admin Route",
    });
});
/** ---------------- Vandor ----------------------------- **/
router.post("/vandor", adminController_1.createVandor);
router.get("/vandors", adminController_1.getVandors);
router.get("/vandor/:id", adminController_1.getVandorByID);
/** ----------------------- Transaction --------------------- **/
router.get("/transactions", adminController_1.getTransactions);
router.get("/transaction/:id", adminController_1.getTransactionById);
/** --------------------- Delivery -------------------------- **/
router.put("/delivery/verify", adminController_1.verifyDeliveryUser);
router.get("/delivery/users", adminController_1.getDeliveryUsers);
router.get("/delivery/user/:id", adminController_1.getDeliveryUserById);
exports.default = router;
//# sourceMappingURL=adminRoute.js.map