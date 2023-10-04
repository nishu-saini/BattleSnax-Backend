import { Request, Response, NextFunction } from "express";
import { createVandorInput } from "../dto/vandor.dto";

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

  res.json({
    name,
    address,
    pincode,
    foodType,
    email,
    password,
    ownerName,
    phone,
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
