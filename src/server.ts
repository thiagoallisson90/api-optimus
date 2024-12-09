import cors from "cors";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
//import path from "path";

import { connectDB } from "./config/db.js";

import userRouter from "./routes/UserRoute.js";
import profileRouter from "./routes/ProfileRoute.js";
import userLoRaSimRouter from "./routes/UserLoRaSimulationRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/userlorasim", userLoRaSimRouter);

app.use("/", (req: Request, res: Response): any => {
  return res.status(400).json({
    error: "URL is invalid!",
  });
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running in port ${PORT}`);
});
