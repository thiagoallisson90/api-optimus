import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn: mongoose.Mongoose = await mongoose.connect(
      process.env.MONGO_URI || ""
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error(`Error: ${error}`);
    }
    process.exit(1);
  }
};
