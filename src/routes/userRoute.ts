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
import { isAuthenticated } from "../middlewares/auth";

const router = express.Router();

// User Athenctication
router.post("/signup", signup);
router.post("/login", login);
router.patch("/verify", isAuthenticated, userVerify);
router.get("/otp", isAuthenticated, requestOtp);

// profile
router
  .route("/profile")
  .get(isAuthenticated, getProfile)
  .patch(isAuthenticated, editProfile);

// Cart
router
  .route("/cart")
  .post(isAuthenticated, addToCart)
  .get(isAuthenticated, getCart)
  .delete(isAuthenticated, deleteCart);

// Order
router.post("/create-order", isAuthenticated, createOrder);
router.get("/orders", isAuthenticated, getOrders);
router.get("/order/:id", isAuthenticated, getOrderById);

// Payment

export default router;
