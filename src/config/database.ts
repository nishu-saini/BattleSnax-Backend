import mongoose from "mongoose";
import { MONGO_URI } from "./config";

export default async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "Battlesnax",
    });
    console.log(`Database Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}
