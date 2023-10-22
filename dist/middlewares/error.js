"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
const errorMiddleware = (err, req, res, next) => {
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
exports.errorMiddleware = errorMiddleware;
exports.default = ErrorHandler;
//# sourceMappingURL=error.js.map