import express from "express";
import {
  deliveryUserLogin,
  deliveryUserSignUp,
  editDeliveryUserProfile,
  getDeliveryUserProfile,
  updateDeliveryUserStatus,
} from "../controllers/deliveryController";
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router();

/** -------------------- User Athenctication ------------------------- **/
router.post("/signup", deliveryUserSignUp);
router.post("/login", deliveryUserLogin);

/** ------------------------ Change Service Status --------------------- **/
router.put("/change-status", isAuthenticated, updateDeliveryUserStatus);

/** ------------------------------- profile ---------------------------- **/
router
  .route("/profile")
  .get(isAuthenticated, getDeliveryUserProfile)
  .patch(isAuthenticated, editDeliveryUserProfile);

export default router;
