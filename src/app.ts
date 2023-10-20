import express from "express";
import { config } from "dotenv";
import adminRoute from "./routes/adminRoute";
import vandorRoute from "./routes/vandorRoute";
import shoppingRoute from "./routes/shoppingRoute";
import userRoute from "./routes/userRoute";
import deliveryRoute from "./routes/deliveryRoute";
import cors from "cors";

const app = express();

// Configuration for .env
config({
  path: "./.env",
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const frontendURL = process.env.FRONTEND_URL || "http://127.0.0.1:5173";
app.use(
  cors({
    origin: [frontendURL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/admin", adminRoute);
app.use("/vandor", vandorRoute);
app.use(shoppingRoute);
app.use("/user", userRoute);
app.use("/delivery", deliveryRoute);

export default app;
