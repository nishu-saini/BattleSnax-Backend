import app from "./app";
import connectDB from "./config/database";

// connect database
connectDB();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
