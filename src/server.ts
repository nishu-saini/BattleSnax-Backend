import app from "./app";
import connectDB from "./config/database";

// Handling Uncaught Exception
process.on("uncaughtException", (err: Error) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// connect database
connectDB();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
