import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import "express-async-errors";

import { connectDB } from "./config/db.js";

import userRouter from "./routes/UserRoute.js";
import profileRouter from "./routes/ProfileRoute.js";
import userLoRaSimRouter from "./routes/UserLoRaSimulationRoute.js";
import userLoRaSimAppRouter from "./routes/UserLoRaSimAppRoute.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/simulation", userLoRaSimRouter);
//app.use("/api/userlorasimapp", userLoRaSimAppRouter);

app.use("/files", express.static(path.join(__dirname, "files")));

app.use(
  (error: Error, req: Request, res: Response, next: NextFunction): any => {
    return res.status(500).json({
      ok: false,
      status: "Error",
      message: error.message,
    });
  }
);

app.use("/", (req: Request, res: Response): any => {
  return res.status(400).json({
    ok: false,
    status: "Error",
    message: "URL is invalid!",
  });
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running in port ${PORT}`);
});
