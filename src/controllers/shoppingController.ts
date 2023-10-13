import { Request, Response, NextFunction } from "express";
import { FoodDoc } from "../models/food.model";
import { Offer } from "../models/offer.model";
import { Vandor } from "../models/vandor.model";

export const getFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode } = req.params;

  const result = await Vandor.find({ pincode, serviceAvailable: true })
    .sort([["rating", "descending"]])
    .populate("foods");

  if (result.length == 0) {
    return res.status(400).json({
      message: "Data Not Found",
    });
  }

  res.status(200).json(result);
};

export const getTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode } = req.params;

  const result = await Vandor.find({ pincode, serviceAvailable: true })
    .sort([["rating", "descending"]])
    .limit(10);

  if (result.length == 0) {
    return res.status(400).json({
      message: "Data Not Found",
    });
  }

  res.status(200).json(result);
};

export const getFoodIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode } = req.params;

  const result = await Vandor.find({
    pincode,
    serviceAvailable: true,
  }).populate("foods");

  if (result.length == 0) {
    return res.status(400).json({
      message: "Data Not Found",
    });
  }

  // find foods in vandor
  let foodResult: any = [];

  result.forEach((vandor) => {
    const foods = vandor.foods as [FoodDoc];

    foodResult.push(...foods.filter((food) => food.readyTime <= 30));
  });

  res.status(200).json(foodResult);
};

export const searchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode } = req.params;

  const result = await Vandor.find({
    pincode,
    serviceAvailable: true,
  }).populate("foods");

  if (result.length == 0) {
    return res.status(400).json({
      message: "Data Not Found",
    });
  }

  // find foods in vandor
  let foodResult: any = [];

  result.forEach((vandor) => {
    foodResult.push(...vandor.foods);
  });

  res.status(200).json(foodResult);
};

export const restaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const vandor = await Vandor.findById(id).populate("foods");

  if (!vandor) {
    return res.status(400).json({
      message: "Restaurant Not Found",
    });
  }

  res.status(400).json(vandor);
};

export const getAvailableOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const offers = await Offer.find({ pincode, isActive: true });

  if (offers) {
    return res.status(200).json(offers);
  }

  res.status(400).json({
    message: "Offer Not Found!",
  });
};
