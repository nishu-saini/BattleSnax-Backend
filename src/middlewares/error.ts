import { NextFunction, Request, Response } from "express";

class ErrorHandler extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Wrong Mongodb ID error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: Mongodb ID`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate key error
  if (err.statusCode === 11000) {
    const message = `Mongoose duplicate key error`;
    err = new ErrorHandler(message, 400);
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
