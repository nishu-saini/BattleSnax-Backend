import { NextFunction, Request, Response } from "express";

import { authPayload } from "../dto/auth.dto";
import { validateSignature } from "../utility/password";

declare global {
  namespace Express {
    interface Request {
      user?: authPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = await validateSignature(req);

  if (validate) {
    return next();
  }

  return res.json({
    message: "user not Authorized",
  });
};
