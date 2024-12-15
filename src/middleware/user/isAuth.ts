import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

export const isAuth: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({
      message: "Unauthorized, token is missing!",
    });
  }

  const token = authToken.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET || "123@";

  try {
    jwt.verify(token, jwtSecret);

    return next();
  } catch (error: any) {
    return res.status(401).json({
      message: "Unauthorized, token invalid!",
    });
  }
};
