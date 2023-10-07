import express from "express";
import {
  editProfile,
  getProfile,
  login,
  requestOtp,
  signup,
  userVerify,
} from "../controllers/userController";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

// Signup / Create Account
router.post("/signup", signup);

// Login
router.post("/login", login);

// Verify customer account
router.patch("/verify", authenticate, userVerify);

// Request OTP
router.get("/otp", authenticate, requestOtp);

// profile
router
  .route("/profile")
  .get(authenticate, getProfile)
  .patch(authenticate, editProfile);

// Cart
// Order
// Payment

export default router;
