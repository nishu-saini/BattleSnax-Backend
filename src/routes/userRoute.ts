import express from "express";
import {
  addToCart,
  createOrder,
  deleteCart,
  editProfile,
  getCart,
  getOrderById,
  getOrders,
  getProfile,
  login,
  requestOtp,
  signup,
  userVerify,
} from "../controllers/userController";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

// User Athenctication
router.post("/signup", signup);
router.post("/login", login);
router.patch("/verify", authenticate, userVerify);
router.get("/otp", authenticate, requestOtp);

// profile
router
  .route("/profile")
  .get(authenticate, getProfile)
  .patch(authenticate, editProfile);

// Cart
router
  .route("/cart")
  .post(authenticate, addToCart)
  .get(authenticate, getCart)
  .delete(authenticate, deleteCart);

// Order
router.post("/create-order", authenticate, createOrder);
router.get("/orders", authenticate, getOrders);
router.get("/order/:id", authenticate, getOrderById);

// Payment

export default router;
