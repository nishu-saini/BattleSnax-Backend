import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import {
  CreateUserInputs,
  EditUserProfileInputs,
  OrderInputs,
  UserLoginInputs,
} from "../dto/user.dto";
import { Food } from "../models/food.model";
import { Order } from "../models/order.model";
import { User } from "../models/user.model";
import { generateOtp, onRequestOTP } from "../utility/notification";
import {
  generateSalt,
  generateToken,
  hashedPassword,
  validatePassword,
} from "../utility/password";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userInputs = plainToClass(CreateUserInputs, req.body);

  const inputErrors = await validate(userInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, phone, password } = userInputs;

  const salt = await generateSalt();
  const userPassword = await hashedPassword(password, salt);

  const { otp, expiry } = generateOtp();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      message: "A user is already existed with this email",
    });
  }

  const result = await User.create({
    email,
    password: userPassword,
    salt,
    phone,
    otp,
    otp_expiry: expiry,
    firstName: "Steve",
    lastName: "Roger",
    address: "Somewhere on earth",
    verified: false,
    lat: 0,
    lng: 0,
    orders: [],
  });

  if (result) {
    // send the otp to customer
    await onRequestOTP(otp, phone);

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

export const login = async (
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

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User Not Found Please Signup!",
    });
  }

  // check if entered password is correct
  const validation = await validatePassword(password, user.password);

  if (validation) {
    // generate token
    const token = generateToken({
      _id: user._id,
      email: user.email,
      verified: user.verified,
    });

    // send the result to client
    return res.status(201).json({
      token,
      verified: user.verified,
      email: user.email,
    });
  }

  res.status(404).json({
    message: "Invalid Password",
  });
};

export const userVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const user = req.user;

  if (user) {
    const profile = await User.findById(user._id);

    if (profile) {
      // Check enter otp is right and entered before expire
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const result = await profile.save();

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
    }
  }

  return res.status(400).json({
    message: "Error with OTP Validation",
  });
};

export const requestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const profile = await User.findById(user._id);

    if (profile) {
      const { otp, expiry } = generateOtp();

      profile.otp = otp;
      profile.otp_expiry = expiry;

      await profile.save();
      await onRequestOTP(otp, profile.phone);

      return res.status(200).json({
        message: "OTP sent to your register phone number",
      });
    }
  }

  res.status(400).json({
    message: "Error with Request OTP",
  });
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const profile = await User.findById(user._id);

    if (profile) {
      return res.status(200).json(profile);
    }
  }

  res.status(400).json({
    message: "Something went wrong, Try Again!",
  });
};

export const editProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  const profileInputs = plainToClass(EditUserProfileInputs, req.body);

  const profileErrors = await validate(profileInputs, {
    validationError: { target: false },
  });

  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
  }

  const { firstName, lastName, address } = profileInputs;

  if (user) {
    const profile = await User.findById(user._id);

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

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // grab current login customer
  const user = req.user;

  if (user) {
    // create an order ID
    const orderId = `${Math.floor(100000 + Math.random() * 900000)}`;

    const profile = await User.findById(user._id);

    // Grab order items from request [ { id: XX, unit: XX } ]
    const cart = <[OrderInputs]>req.body; // [ { id: XX, unit: XX } ]

    let cartItems = [],
      netAmount = 0;

    // // Calculate order amount
    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item) => item._id));

    foods.forEach((food) => {
      cart.forEach(({ _id, unit }) => {
        if (food._id == _id) {
          netAmount += food.price * unit;
          cartItems.push({ food, unit });
        }
      });
    });

    // Create order with item description
    if (cartItems) {
      // create Order
      const currentOrder = await Order.create({
        orderID: orderId,
        items: cartItems,
        totalAmount: netAmount,
        orderDate: new Date(),
        paidThrough: "COD",
        payementResponse: "",
        orderStatus: "Waiting",
      });

      // Finally update orders to user account
      if (currentOrder) {
        profile.orders.push(currentOrder);
        await profile.save();

        return res.status(200).json(currentOrder);
      }
    }
  }

  res.status(400).json({
    message: "Error with Create Order",
  });
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const profile = await User.findById(user._id).populate("orders");

    if (profile) {
      return res.status(200).json(profile.orders);
    }
  }

  res.status(400).json({
    message: "Something went wrong, Try Again!",
  });
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;

  if (orderId) {
    const order = await (await Order.findById(orderId)).populate("items.food");

    return res.status(200).json(order);
  }

  res.status(400).json({
    message: "Something went wrong, Try Again!",
  });
};
