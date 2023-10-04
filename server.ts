import app from "./app";
import { PORT } from "./config/config";
import connectDB from "./config/database";

// connect database
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
