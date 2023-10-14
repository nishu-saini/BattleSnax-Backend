import { NextFunction, Request, Response } from "express";
import { createFoodInputs } from "../dto/food.dto";
import {
  createOfferInputs,
  editVandorInputs,
  vandorLoginInputs,
} from "../dto/vandor.dto";
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

export const updateVandorCoverProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const vandor = await findVandor(user._id);

    if (vandor) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      vandor.coverImages.push(...images);

      const result = await vandor.save();

      return res.json(result);
    }
  }

  res.json({
    message: "Something went wrong while updating cover image",
  });
};

export const updateVandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const getCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const orders = await Order.find({ vandorId: user._id }).populate(
      "items.food"
    );

    if (orders) {
      return res.status(200).json(orders);
    }
  }

  res.status(404).json({
    message: "Order Not Found",
  });
};

export const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");

    if (order) {
      return res.status(200).json(order);
    }
  }

  res.status(404).json({
    message: "Order Not Found",
  });
};

export const processOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

  res.status(400).json({
    message: "Order Not Found",
  });
};

/** ---------------------- Offer Section ------------------------- **/

export const getOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

  res.status(404).json({
    message: "Offer Not Found",
  });
};

export const addOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

  res.status(400).json({
    message: "Unable to Add Offer",
  });
};

export const editOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

  res.status(404).json({
    message: "Offer Not Found!",
  });
};
