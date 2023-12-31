import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import {
  CartItem,
  CreateUserInputs,
  EditUserProfileInputs,
  OrderInputs,
  UserLoginInputs,
} from "../dto/user.dto";
import ErrorHandler from "../middlewares/error";
import { Food } from "../models/food.model";
import { Offer } from "../models/offer.model";
import { Order } from "../models/order.model";
import { Transaction } from "../models/transaction.model";
import { User } from "../models/user.model";
import {
  assignOrderForDelivery,
  generateOtp,
  onRequestOTP,
} from "../utility/notification";
import {
  generateSalt,
  generateToken,
  hashedPassword,
  validatePassword,
} from "../utility/password";
import { validateTransaction } from "../utility/transaction";

/** ------------------ Authentication Section ------------------ **/

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
      return next(
        new ErrorHandler("A user is already existed with this email", 409)
      );
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

    return next(new ErrorHandler("Error in Signup", 400));
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
      return next(new ErrorHandler("User Not Found", 404));
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

    return next(new ErrorHandler("Invalid Password", 400));
  } catch (error) {
    next(error);
  }
};

export const userVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

    return next(new ErrorHandler("Error with OTP Validation", 400));
  } catch (error) {
    next(error);
  }
};

export const requestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

    return next(new ErrorHandler("Error with Request OTP", 400));
  } catch (error) {
    next(error);
  }
};

/** ------------------ Profile Section ------------------ **/

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const profile = await User.findById(user._id);

      if (profile) {
        return res.status(200).json(profile);
      }
    }

    return next(new ErrorHandler("Something went wrong, Try Again", 400));
  } catch (error) {
    next(error);
  }
};

export const editProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

    return next(new ErrorHandler("Something went wrong, Try Again!", 400));
  } catch (error) {
    next(error);
  }
};

/** ------------------ Cart Section ------------------ **/

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const profile = await User.findById(user._id).populate("cart.food");

      let cartItems = [];

      const { _id, unit } = <CartItem>req.body;

      const food = await Food.findById(_id);

      if (profile && food) {
        // check for cart items
        cartItems = profile.cart;

        if (cartItems.length > 0) {
          // check and update units
          let existingItem = cartItems.filter(
            (item) => item.food._id.toString() === _id
          );

          if (existingItem.length > 0) {
            const index = cartItems.indexOf(existingItem[0]);

            if (unit > 0) {
              cartItems[index] = { food, unit };
            } else {
              cartItems.splice(index, 1);
            }
          } else {
            cartItems.push({ food, unit });
          }
        } else {
          cartItems.push({ food, unit });
        }

        if (cartItems) {
          profile.cart = cartItems as any;
          const result = await profile.save();

          return res.status(200).json(result.cart);
        }
      }

      return next(new ErrorHandler("Something went wrong, Try Again!", 400));
    }
  } catch (error) {
    next(error);
  }
};

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const profile = await User.findById(user._id).populate("cart.food");

      if (profile) {
        return res.status(200).json(profile.cart);
      }
    }

    return next(new ErrorHandler("Something went wrong, Try Again!", 400));
  } catch (error) {
    next(error);
  }
};

export const deleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const profile = await User.findById(user._id).populate("cart.food");

      if (profile) {
        profile.cart = [] as any;
        await profile.save();

        return res.status(200).json(profile.cart);
      }
    }

    return next(new ErrorHandler("Something went wrong, Try Again!", 400));
  } catch (error) {
    next(error);
  }
};

/** -------------------- Payment Section ------------------- **/

export const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    const { amount, paymentMode, offerId } = req.body;

    let payableAmount = Number(amount);

    if (offerId) {
      const offer = await Offer.findById(offerId);

      if (offer && offer.isActive) {
        payableAmount = payableAmount - offer.offerAmount;
      }
    }

    // Perform Payment gateway Charge API call

    // Create record on Transaction
    const transaction = await Transaction.create({
      user: user._id,
      vandorId: "",
      orderId: "",
      orderValue: payableAmount,
      offerUsed: offerId || "NA",
      status: "OPEN",
      paymentMode: paymentMode,
      paymentResponse: "Payment is Cash on Delivery",
    });

    // return transaction ID
    return res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

/** ------------------ Order Section ------------------ **/

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // grab current login customer
    const user = req.user;

    const { transactionId, amount, items } = <OrderInputs>req.body;

    if (user) {
      // validate transaction
      const { status, transaction } = await validateTransaction(transactionId);

      if (!status) {
        return next(new ErrorHandler("Error with Create Order", 400));
      }

      // create an order ID
      const orderId = `${Math.floor(100000 + Math.random() * 900000)}`;

      const profile = await User.findById(user._id);

      let cartItems = [],
        netAmount = 0;

      let vandorId: string;

      // // Calculate order amount
      const foods = await Food.find()
        .where("_id")
        .in(items.map((item) => item._id));

      foods.forEach((food) => {
        items.forEach(({ _id, unit }) => {
          if (food._id == _id) {
            vandorId = food.vandorId;
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
          vandorId: vandorId,
          items: cartItems,
          totalAmount: netAmount,
          paidAmount: amount,
          orderDate: new Date(),
          orderStatus: "Waiting",
          remarks: "",
          deliveryId: "",
          readyTime: 45,
        });

        // make cart empty
        profile.cart = [] as any;
        // Finally update orders to user account
        profile.orders.push(currentOrder);

        await profile.save();

        transaction.vandorId = vandorId;
        transaction.orderId = orderId;
        transaction.status = "CONFIRMED";

        await transaction.save();

        assignOrderForDelivery(currentOrder._id, vandorId);

        return res.status(200).json(currentOrder);
      }
    }

    return next(new ErrorHandler("Error with Create Order", 400));
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const profile = await User.findById(user._id).populate("orders");

      if (profile) {
        return res.status(200).json(profile.orders);
      }
    }

    return next(new ErrorHandler("Something went wrong, Try Again!", 400));
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = req.params.id;

    if (orderId) {
      const order = await (
        await Order.findById(orderId)
      ).populate("items.food");

      return res.status(200).json(order);
    }

    return next(new ErrorHandler("Something went wrong, Try Again!", 400));
  } catch (error) {
    next(error);
  }
};

/** ---------------------- Offer Section ------------------------- **/

export const verifyOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const offerId = req.params.id;

    const user = req.user;

    if (user) {
      const appliedOffer = await Offer.findById(offerId);

      if (appliedOffer) {
        if (appliedOffer.promoType === "USER") {
          // Only can apply once per user
        } else {
          if (appliedOffer.isActive) {
            return res.status(200).json({
              message: "Offer is Valid",
              offer: appliedOffer,
            });
          }
        }
      }
    }

    return next(new ErrorHandler("Offer Not Found", 404));
  } catch (error) {
    next(error);
  }
};
