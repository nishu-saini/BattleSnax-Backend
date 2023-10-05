import bcrypt from "bcrypt";
import { vandorPayload } from "../dto/vandor.dto";
import Jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";
import { authPayload } from "../dto/auth.dto";
import { Request } from "express";

export const generateSalt = async () => {
  return await bcrypt.genSalt(10);
};

export const hashedPassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
  enteredPassword: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

export const generateToken = (payload: vandorPayload) => {
  return Jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const validateSignature = async (req: Request) => {
  const token = req.get("Authorization");

  if (token) {
    const payload = (await Jwt.verify(
      token.split(" ")[1],
      JWT_SECRET
    )) as authPayload;

    req.user = payload;

    return true;
  }

  return false;
};
