import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../middlewares/error";
import { FoodDoc } from "../models/food.model";
import { Offer } from "../models/offer.model";
import { Vandor } from "../models/vandor.model";

export const getFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pincode } = req.params;

    const result = await Vandor.find({ pincode, serviceAvailable: true })
      .sort([["rating", "descending"]])
      .populate("foods");

    if (result.length == 0) {
      return next(new ErrorHandler("Food Not Found", 404));
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pincode } = req.params;

    const result = await Vandor.find({ pincode, serviceAvailable: true })
      .sort([["rating", "descending"]])
      .limit(10);

    if (result.length == 0) {
      return next(new ErrorHandler("Data Not Found", 404));
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getFoodIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pincode } = req.params;

    const result = await Vandor.find({
      pincode,
      serviceAvailable: true,
    }).populate("foods");

    if (result.length == 0) {
      return next(new ErrorHandler("Data Not Found", 404));
    }

    // find foods in vandor
    let foodResult: any = [];

    result.forEach((vandor) => {
      const foods = vandor.foods as [FoodDoc];

      foodResult.push(...foods.filter((food) => food.readyTime <= 30));
    });

    res.status(200).json(foodResult);
  } catch (error) {
    next(error);
  }
};

export const searchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pincode } = req.params;

    const result = await Vandor.find({
      pincode,
      serviceAvailable: true,
    }).populate("foods");

    if (result.length == 0) {
      return next(new ErrorHandler("Food Not Found", 404));
    }

    // find foods in vandor
    let foodResult: any = [];

    result.forEach((vandor) => {
      foodResult.push(...vandor.foods);
    });

    res.status(200).json(foodResult);
  } catch (error) {
    next(error);
  }
};

export const restaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const vandor = await Vandor.findById(id).populate("foods");

    if (!vandor) {
      return next(new ErrorHandler("Restaurant Not Found", 404));
    }

    res.status(400).json(vandor);
  } catch (error) {
    next(error);
  }
};

export const getAvailableOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const pincode = req.params.pincode;

    const offers = await Offer.find({ pincode, isActive: true });

    if (offers) {
      return res.status(200).json(offers);
    }

    return next(new ErrorHandler("Offer Not Found", 404));
  } catch (error) {
    next(error);
  }
};
