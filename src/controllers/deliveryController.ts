import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import {
  CreateDeliveryUserInputs,
  EditUserProfileInputs,
  UserLoginInputs,
} from "../dto/user.dto";
import { DeliveryUser } from "../models/deliveryUser.model";
import {
  generateSalt,
  generateToken,
  hashedPassword,
  validatePassword,
} from "../utility/password";

/** ------------------ Authentication Section ------------------ **/

export const deliveryUserSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUserInputs = plainToClass(CreateDeliveryUserInputs, req.body);

  const inputErrors = await validate(deliveryUserInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, phone, password, address, firstName, lastName, pincode } =
    deliveryUserInputs;

  const salt = await generateSalt();
  const userPassword = await hashedPassword(password, salt);

  const existingDeliveryUser = await DeliveryUser.findOne({ email });

  if (existingDeliveryUser) {
    return res.status(409).json({
      message: "A Delivery User is already existed with this email",
    });
  }

  const result = await DeliveryUser.create({
    email,
    password: userPassword,
    salt,
    phone,
    firstName,
    lastName,
    pincode,
    address,
    verified: false,
    lat: 0,
    lng: 0,
    isAvailable: false,
  });

  if (result) {
    // generate token
    const token = generateToken({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });

    // send the result to client
    return res.status(201).json({
      token,
      verified: result.verified,
      email: result.email,
    });
  }

  res.status(401).json({
    message: "Error in Signup",
  });
};

export const deliveryUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginInputs = plainToClass(UserLoginInputs, req.body);

  const loginErrors = await validate(loginInputs, {
    validationError: { target: false },
  });

  if (loginErrors.length > 0) {
    return res.status(400).json(loginErrors);
  }

  const { email, password } = loginInputs;

  const deliveryUser = await DeliveryUser.findOne({ email });

  if (!deliveryUser) {
    return res.status(404).json({
      message: "User Not Found Please Signup!",
    });
  }

  // check if entered password is correct
  const validation = await validatePassword(password, deliveryUser.password);

  if (validation) {
    // generate token
    const token = generateToken({
      _id: deliveryUser._id,
      email: deliveryUser.email,
      verified: deliveryUser.verified,
    });

    // send the result to client
    return res.status(201).json({
      token,
      verified: deliveryUser.verified,
      email: deliveryUser.email,
    });
  }

  res.status(404).json({
    message: "Invalid Password",
  });
};

/** ------------------ Profile Section ------------------ **/

export const getDeliveryUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = req.user;

  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);

    if (profile) {
      return res.status(200).json(profile);
    }
  }

  res.status(400).json({
    message: "Something went wrong, Try Again!",
  });
};

export const editDeliveryUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = req.user;

  const profileInputs = plainToClass(EditUserProfileInputs, req.body);

  const profileErrors = await validate(profileInputs, {
    validationError: { target: false },
  });

  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
  }

  const { firstName, lastName, address } = profileInputs;

  if (deliveryUser) {
    const profile = await DeliveryUser.findById(deliveryUser._id);

    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;

      const result = await profile.save();

      return res.status(200).json(result);
    }
  }

  res.status(400).json({
    message: "Something went wrong, Try Again!",
  });
};

export const updateDeliveryUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryUser = req.user;

  if (deliveryUser) {
    const { lat, lng } = req.body;

    const profile = await DeliveryUser.findById(deliveryUser._id);

    if (profile) {
      if (lat && lng) {
        profile.lat = lat;
        profile.lng = lng;
      }

      profile.isAvailable = !profile.isAvailable;

      const result = await profile.save();

      return res.status(201).json(result);
    }
  }

  return res.status(400).json({
    message: "Error with Update Status",
  });
};
