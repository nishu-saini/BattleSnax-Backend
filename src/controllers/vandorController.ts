import { NextFunction, Request, Response } from "express";
import { createFoodInputs } from "../dto/food.dto";
import {
  createOfferInputs,
  editVandorInputs,
  vandorLoginInputs,
} from "../dto/vandor.dto";
import ErrorHandler from "../middlewares/error";
import { Food } from "../models/food.model";
import { Offer } from "../models/offer.model";
import { Order } from "../models/order.model";
import { generateToken, validatePassword } from "../utility/password";
import { findVandor } from "../utility/vandor";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

        return res.status(201).json({
          token: jwt_token,
        });
      }

      return next(new ErrorHandler("Password is not valid", 400));
    }

    return next(new ErrorHandler("Login credentials not valid", 400));
  } catch (error) {
    next(error);
  }
};

export const getVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const vandor = await findVandor(user._id);

      return res.status(200).json(vandor);
    }

    return next(new ErrorHandler("Vandor information Not Found", 404));
  } catch (error) {
    next(error);
  }
};

export const updateVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
        return res.status(200).json(savedResult);
      }
    }

    return next(new ErrorHandler("Vandor information Not Found", 404));
  } catch (error) {
    next(error);
  }
};

export const updateVandorCoverProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      // Upload Image to Cloudnary
    }

    return next(
      new ErrorHandler("Something went wrong while updating cover image", 400)
    );
  } catch (error) {
    next(error);
  }
};

export const updateVandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { lat, lng } = req.body;

    if (user) {
      const vandor = await findVandor(user._id);

      if (vandor) {
        vandor.serviceAvailable = !vandor.serviceAvailable;

        if (lat && lng) {
          vandor.lat = lat;
          vandor.lng = lng;
        }

        const savedResult = await vandor.save();
        return res.status(200).json(savedResult);
      }
    }

    return next(new ErrorHandler("Vandor information not found", 404));
  } catch (error) {
    next(error);
  }
};

export const addFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const { name, description, category, foodType, readyTime, price } = <
        createFoodInputs
      >req.body;

      const vandor = await findVandor(user._id);

      if (vandor) {
        const files = req.files as [Express.Multer.File];

        const images = files.map((file: Express.Multer.File) => file.filename);

        const createFood = await Food.create({
          vandorId: vandor._id,
          name,
          description,
          category,
          foodType,
          images,
          readyTime,
          price,
          rating: 0,
        });

        vandor.foods.push(createFood);
        const result = await vandor.save();

        return res.status(200).json(result);
      }
    }

    return next(new ErrorHandler("Some went wrong with add food", 400));
  } catch (error) {
    next(error);
  }
};

export const getFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const foods = await Food.find({ vandorId: user._id });

      if (!foods) {
        return next(new ErrorHandler("Food information not found", 400));
      }

      res.status(200).json(foods);
    }
  } catch (error) {
    next(error);
  }
};

export const getCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const orders = await Order.find({ vandorId: user._id }).populate(
        "items.food"
      );

      if (orders) {
        return res.status(200).json(orders);
      }
    }

    return next(new ErrorHandler("Order not found", 404));
  } catch (error) {
    next(error);
  }
};

export const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = req.params.id;

    if (orderId) {
      const order = await Order.findById(orderId).populate("items.food");

      if (order) {
        return res.status(200).json(order);
      }
    }

    return next(new ErrorHandler("Order not found", 404));
  } catch (error) {
    next(error);
  }
};

export const processOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderId = req.params.id;
    const { status, remarks, time } = req.body;

    const order = await Order.findById(orderId).populate("items.food");

    if (order) {
      order.orderStatus = status;
      order.remarks = remarks;

      if (time) {
        order.readyTime = time;
      }

      const result = await order.save();

      return res.status(200).json(result);
    }

    return next(new ErrorHandler("Order not found", 404));
  } catch (error) {
    next(error);
  }
};

/** ---------------------- Offer Section ------------------------- **/

export const getOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      let currentOffers = [];

      const offers = await Offer.find().populate("vandors");

      if (offers) {
        offers.forEach((offer) => {
          // if vandor available..
          if (offer.vandors) {
            offer.vandors.forEach((vandor) => {
              if (vandor._id.toString() === user._id) {
                currentOffers.push(offer);
              }
            });
          }

          // GENERIC Offer
          else if (offer.offerType === "GENERIC") {
            currentOffers.push(offer);
          }
        });

        return res.status(200).json(currentOffers);
      }
    }

    return next(new ErrorHandler("Offer not found", 404));
  } catch (error) {
    next(error);
  }
};

export const addOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const {
        title,
        description,
        offerType,
        offerAmount,
        pincode,
        promocode,
        promoType,
        startValidity,
        endValidity,
        bank,
        bins,
        minValue,
        isActive,
      } = <createOfferInputs>req.body;

      const vandor = await findVandor(user._id);

      if (vandor) {
        const offer = await Offer.create({
          title,
          description,
          offerType,
          offerAmount,
          pincode,
          promocode,
          promoType,
          startValidity,
          endValidity,
          bank,
          bins,
          isActive,
          minValue,
          vandors: [vandor],
        });

        return res.status(200).json(offer);
      }
    }

    return next(new ErrorHandler("Unable to add Offer", 400));
  } catch (error) {
    next(error);
  }
};

export const editOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    const offerId = req.params.id;

    if (user) {
      const {
        title,
        description,
        offerType,
        offerAmount,
        pincode,
        promocode,
        promoType,
        startValidity,
        endValidity,
        bank,
        bins,
        minValue,
        isActive,
      } = <createOfferInputs>req.body;

      const offer = await Offer.findById(offerId);

      if (offer) {
        const vandor = await findVandor(user._id);

        if (vandor) {
          // update offer

          (offer.title = title), (offer.description = description);
          offer.offerType = offerType;
          offer.offerAmount = offerAmount;
          offer.pincode = pincode;
          offer.promocode = promocode;
          offer.promoType = promoType;
          offer.startValidity = startValidity;
          offer.endValidity = endValidity;
          offer.bank = bank;
          offer.bins = bins;
          offer.minValue = minValue;
          offer.isActive = isActive;

          const result = await offer.save();

          return res.status(200).json(result);
        }
      }
    }

    return next(new ErrorHandler("Offer not found", 404));
  } catch (error) {
    next(error);
  }
};
