import express from "express";
import adminRoute from "./routes/adminRoute";
import vandorRoute from "./routes/vandorRoute";
import bodyParser from "body-parser";

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/admin", adminRoute);
app.use("/vandor", vandorRoute);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
