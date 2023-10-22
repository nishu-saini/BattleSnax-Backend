import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
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

export const generateToken = (payload: authPayload) => {
  return Jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const validateSignature = async (req: Request) => {
  const token = req.get("Authorization");

  if (token) {
    // check if token valid
    try {
      const payload = Jwt.verify(
        token.split(" ")[1],
        process.env.JWT_SECRET
      ) as authPayload;

      req.user = payload;

      return true;
    } catch (error) {
      // token expired
      return false;
    }
  }

  return false;
};
