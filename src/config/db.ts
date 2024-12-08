import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      if (process.env.NODE_ENV === "development") {
        console.log(`MongoDB Connected`);
      }
    });

    mongoose.connection.on("error", (error: any) => {
      if (process.env.NODE_ENV === "development") {
        console.error("Error on connection", error);
      }
    });

    await mongoose.connect(process.env.MONGO_URI || "");

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("Conection closed");
      process.exit(0);
    });
  } catch (error: any) {
    if (process.env.NODE_ENV === "development") {
      console.error(`Error: ${error}`);
    }
    process.exit(1);
  }
};
