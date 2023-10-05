import express from "express";
import bodyParser from "body-parser";
import adminRoute from "./routes/adminRoute";
import vandorRoute from "./routes/vandorRoute";
import path from "path";

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

// Routes
app.use("/admin", adminRoute);
app.use("/vandor", vandorRoute);

export default app;
