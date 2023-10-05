import express, { Request, Response, NextFunction } from "express";
import {
  addFood,
  getFoods,
  getVandorProfile,
  login,
  updateVandorProfile,
  updateVandorService,
} from "../controllers/vandorController";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "Vandor Route",
  });
});

router.post("/login", login);

router
  .route("/profile")
  .get(authenticate, getVandorProfile)
  .patch(authenticate, updateVandorProfile);

router.route("/service").patch(authenticate, updateVandorService);

router.route("/food").post(authenticate, addFood);

router.route("/foods").get(authenticate, getFoods);

export default router;
