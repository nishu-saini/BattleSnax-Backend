import { Request, Response, NextFunction } from "express";
import { createVandorInput } from "../dto/vandor.dto";
import { DeliveryUser } from "../models/deliveryUser.model";
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
    return res.status(409).json({
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
    lat: 0,
    lng: 0,
  });

  res.status(200).json({
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
    return res.status(200).json(vandors);
  }

  return res.status(400).json({
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
    return res.status(200).json(vandor);
  }

  return res.status(404).json({
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

export const verifyDeliveryUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { _id, status } = req.body;

  if (_id) {
    const profile = await DeliveryUser.findById(_id);

    if (profile) {
      profile.verified = status;

      const result = await profile.save();

      return res.status(200).json(result);
    }
  }

  return res.status(400).json({
    message: "Unable to verify Delivery User",
  });
};

export const getDeliveryUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUsers = await DeliveryUser.find();

  if (deliveryUsers) {
    return res.status(200).json(deliveryUsers);
  }

  return res.status(400).json({
    message: "Delivery User Not Found!",
  });
};

export const getDeliveryUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const deliveryUser = await DeliveryUser.findById(id);

  if (deliveryUser) {
    return res.status(200).json(deliveryUser);
  }

  return res.status(400).json({
    message: "Delivery User Not Found!",
  });
};
