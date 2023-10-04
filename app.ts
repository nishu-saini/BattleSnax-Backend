import express from "express";
import bodyParser from "body-parser";
import adminRoute from "./routes/adminRoute";
import vandorRoute from "./routes/vandorRoute";

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/admin", adminRoute);
app.use("/vandor", vandorRoute);

export default app;
