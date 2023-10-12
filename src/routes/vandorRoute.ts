import express, { Request, Response, NextFunction } from "express";
import {
  addFood,
  addOffer,
  editOffer,
  getCurrentOrders,
  getFoods,
  getOffers,
  getOrderDetails,
  getVandorProfile,
  login,
  processOrder,
  updateVandorCoverProfile,
  updateVandorProfile,
  updateVandorService,
} from "../controllers/vandorController";
import { isAuthenticated } from "../middlewares/auth";
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
  .get(isAuthenticated, getVandorProfile)
  .patch(isAuthenticated, updateVandorProfile);

router
  .route("/coverimage")
  .patch(isAuthenticated, images, updateVandorCoverProfile);

router.route("/service").patch(isAuthenticated, updateVandorService);
router.route("/food").post(isAuthenticated, images, addFood);
router.route("/foods").get(isAuthenticated, getFoods);

// Orders
router.get("/orders", isAuthenticated, getCurrentOrders);
router.get("/order/:id", isAuthenticated, getOrderDetails);
router.put("/order/:id/process", isAuthenticated, processOrder);

// Offers
router.get("/offers", isAuthenticated, getOffers);
router.post("/offer", isAuthenticated, addOffer);
router.put("/offer/:id", isAuthenticated, editOffer);

export default router;
