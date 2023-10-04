import { Request, Response, NextFunction } from "express";
import { createVandorInput } from "../dto/vandor.dto";
import { Vandor } from "../models/vandor.model";
import { genrateSalt, hashedPassword } from "../utility/password";

export const createVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    address,
    pincode,
    foodType,
    email,
    password,
    ownerName,
    phone,
  } = <createVandorInput>req.body;

  const existingVandor = await Vandor.findOne({ email });

  if (existingVandor) {
    return res.json({
      message: "A vandor is already existed with this email ID",
    });
  }

  // generate salt
  const salt = await genrateSalt();
  const userPassword = await hashedPassword(password, salt);

  const vandor = await Vandor.create({
    name,
    address,
    pincode,
    foodType,
    email,
    password: userPassword,
    salt: salt,
    ownerName,
    phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
  });

  res.json({
    vandor,
  });
};

export const getVandors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const getVandorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
