import express from "express";
import {
  getFoodAvailability,
  getFoodIn30Min,
  getTopRestaurants,
  restaurantById,
  searchFoods,
} from "../controllers/shoppingController";

const router = express.Router();

// Food Availablity
router.get("/:pincode", getFoodAvailability);

// Top Restaurants
router.get("/top-restaurants/:pincode", getTopRestaurants);

// Foods available in 30 Minutes
router.get("/foods-in-30-min/:pincode", getFoodIn30Min);

// Search Foods
router.get("/search/:pincode", searchFoods);

// Find Restaurant by ID
router.get("/restaurant/:id", restaurantById);

export default router;
