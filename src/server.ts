import cors from "cors";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";

import { connectDB } from "./config/db.js";

import userRouter from "./routes/UserRoute.js";
import profileRouter from "./routes/ProfileRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/profile", profileRouter);

app.use("/", (req: Request, res: Response): any => {
  return res.status(400).json({
    error: "URL is invalid!",
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running in port ${PORT}`);
});
