import { Request, Response, NextFunction } from "express";
import { createVandorInput } from "../dto/vandor.dto";
import ErrorHandler from "../middlewares/error";
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
  try {
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
      return next(new ErrorHandler("Vandor Already Exist", 409));
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

    res.status(200).json(vandor);
  } catch (error) {
    next(error);
  }
};

export const getVandors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vandors = await Vandor.find();

    if (vandors) {
      return res.status(200).json(vandors);
    }

    return next(new ErrorHandler("Data Not Available", 400));
  } catch (error) {
    next(error);
  }
};

export const getVandorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vandorId = req.params.id;

    const vandor = await findVandor(vandorId);

    if (vandor) {
      return res.status(200).json(vandor);
    }

    return next(new ErrorHandler("Vandor Not Found", 404));
  } catch (error) {
    next(error);
  }
};

/** --------------------- Transaction Section -------------------- **/

export const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactions = await Transaction.find();

    if (transactions) {
      return res.status(200).json(transactions);
    }

    return next(new ErrorHandler("Transaction Not Found", 404));
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const transaction = await Transaction.findById(id);

    if (transaction) {
      return res.status(200).json(transaction);
    }

    return next(new ErrorHandler("Transaction Not Found", 404));
  } catch (error) {
    next(error);
  }
};

export const verifyDeliveryUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id, status } = req.body;

    if (_id) {
      const profile = await DeliveryUser.findById(_id);

      if (profile) {
        profile.verified = status;

        const result = await profile.save();

        return res.status(200).json(result);
      }
    }

    return next(new ErrorHandler("Unable to verify Delivery User", 400));
  } catch (error) {
    next(error);
  }
};

export const getDeliveryUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deliveryUsers = await DeliveryUser.find();

    if (deliveryUsers) {
      return res.status(200).json(deliveryUsers);
    }

    return next(new ErrorHandler("Delivery User Not Found!", 404));
  } catch (error) {
    next(error);
  }
};

export const getDeliveryUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const deliveryUser = await DeliveryUser.findById(id);

    if (deliveryUser) {
      return res.status(200).json(deliveryUser);
    }

    return next(new ErrorHandler("Delivery User Not Found!", 404));
  } catch (error) {
    next(error);
  }
};
