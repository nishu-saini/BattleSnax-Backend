import { Request, Response, NextFunction } from "express";
import { createVandorInput } from "../dto/vandor.dto";
import { Transaction } from "../models/transaction.model";
import { Vandor } from "../models/vandor.model";
import { generateSalt, hashedPassword } from "../utility/password";
import { findVandor } from "../utility/vandor";

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

  const existingVandor = await findVandor("", email);

  if (existingVandor) {
    return res.json({
      message: "A vandor is already existed with this email ID",
    });
  }

  // generate salt
  const salt = await generateSalt();
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
    foods: [],
  });

  res.json({
    vandor,
  });
};

export const getVandors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vandors = await Vandor.find();

  if (vandors) {
    return res.json(vandors);
  }

  return res.json({
    message: "vandors data not available",
  });
};

export const getVandorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vandorId = req.params.id;

  const vandor = await findVandor(vandorId);

  if (vandor) {
    return res.json(vandor);
  }

  return res.json({
    message: "vandor not found",
  });
};

/** --------------------- Transaction Section -------------------- **/

export const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transactions = await Transaction.find();

  if (transactions) {
    return res.status(200).json(transactions);
  }

  return res.status(404).json({
    message: "Transaction not Found!",
  });
};

export const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const transaction = await Transaction.findById(id);

  if (transaction) {
    return res.status(200).json(transaction);
  }

  return res.status(404).json({
    message: "Transaction not Found!",
  });
};
