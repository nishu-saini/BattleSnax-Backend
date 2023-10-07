import express from "express";
import adminRoute from "./routes/adminRoute";
import vandorRoute from "./routes/vandorRoute";
import shoppingRoute from "./routes/shoppingRoute";
import userRoute from "./routes/userRoute";
import path from "path";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

// Routes
app.use("/admin", adminRoute);
app.use("/vandor", vandorRoute);
app.use(shoppingRoute);
app.use("/user", userRoute);

export default app;