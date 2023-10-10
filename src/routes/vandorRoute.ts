import express, { Request, Response, NextFunction } from "express";
import {
  addFood,
  getCurrentOrders,
  getFoods,
  getOrderDetails,
  getVandorProfile,
  login,
  processOrder,
  updateVandorCoverProfile,
  updateVandorProfile,
  updateVandorService,
} from "../controllers/vandorController";
import { authenticate } from "../middlewares/auth";
import multer from "multer";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

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

router
  .route("/coverimage")
  .patch(authenticate, images, updateVandorCoverProfile);

router.route("/service").patch(authenticate, updateVandorService);
router.route("/food").post(authenticate, images, addFood);
router.route("/foods").get(authenticate, getFoods);

// Orders
router.get("/orders", authenticate, getCurrentOrders);
router.get("/order/:id", authenticate, getOrderDetails);
router.put("/order/:id/process", authenticate, processOrder);

export default router;
