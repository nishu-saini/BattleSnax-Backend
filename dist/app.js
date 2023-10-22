"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const vandorRoute_1 = __importDefault(require("./routes/vandorRoute"));
const shoppingRoute_1 = __importDefault(require("./routes/shoppingRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const deliveryRoute_1 = __importDefault(require("./routes/deliveryRoute"));
const cors_1 = __importDefault(require("cors"));
const error_1 = require("./middlewares/error");
const app = (0, express_1.default)();
// Configuration for .env
(0, dotenv_1.config)({
    path: "./.env",
});
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// CORS Implementation
const frontendURL = process.env.FRONTEND_URL || "http://127.0.0.1:5173";
app.use((0, cors_1.default)({
    origin: [frontendURL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
// Routes
app.use("/admin", adminRoute_1.default);
app.use("/vandor", vandorRoute_1.default);
app.use(shoppingRoute_1.default);
app.use("/user", userRoute_1.default);
app.use("/delivery", deliveryRoute_1.default);
// Using Error Middleware
app.use(error_1.errorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map