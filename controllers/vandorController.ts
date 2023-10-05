import { NextFunction, Request, Response } from "express";
import { createFoodInputs } from "../dto/food.dto";
import { editVandorInputs, vandorLoginInputs } from "../dto/vandor.dto";
import { Food } from "../models/food.model";
import { generateToken, validatePassword } from "../utility/password";
import { findVandor } from "../utility/vandor";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <vandorLoginInputs>req.body;

  const vandor = await findVandor("", email);

  if (vandor) {
    const validation = await validatePassword(password, vandor.password);

    if (validation) {
      const jwt_token = generateToken({
        _id: vandor.id,
        email: vandor.email,
        foodType: vandor.foodType,
        name: vandor.name,
      });

      return res.json(jwt_token);
    }

    return res.json({
      message: "Password is not valid",
    });
  }

  return res.json({
    message: "Login credential not valid",
  });
};

export const getVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const vandor = await findVandor(user._id);

    return res.json(vandor);
  }

  res.json({
    message: "Vandor information Not Found",
  });
};

export const updateVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { foodType, name, address, phone } = <editVandorInputs>req.body;

  const user = req.user;

  if (user) {
    const vandor = await findVandor(user._id);

    if (vandor) {
      vandor.name = name;
      vandor.address = address;
      vandor.phone = phone;
      vandor.foodType = foodType;

      const savedResult = await vandor.save();
      return res.json(savedResult);
    }

    return res.json(vandor);
  }

  res.json({
    message: "vandor information Not Found",
  });
};

export const updateVandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const vandor = await findVandor(user._id);

    if (vandor) {
      vandor.serviceAvailable = !vandor.serviceAvailable;

      const savedResult = await vandor.save();

      return res.json(savedResult);
    }

    return res.json(vandor);
  }

  res.json({
    message: "Vandor information Not Found",
  });
};

export const addFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const { name, description, category, foodType, readyTime, price } = <
      createFoodInputs
    >req.body;

    const vandor = await findVandor(user._id);

    if (vandor) {
      const createFood = await Food.create({
        vandorId: vandor._id,
        name,
        description,
        category,
        foodType,
        images: ["mock.jpg"],
        readyTime,
        price,
        rating: 0,
      });

      vandor.foods.push(createFood);
      const result = await vandor.save();

      return res.json(result);
    }
  }

  res.json({
    message: "Something went wrong with add food",
  });
};

export const getFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const foods = await Food.find({ vandorId: user._id });

    if (!foods) {
      return res.json({
        message: "Foods information Not Found",
      });
    }

    res.json(foods);
  }
};
