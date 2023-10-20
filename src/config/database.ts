import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Battlesnax",
    });
    console.log(`Database Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}
