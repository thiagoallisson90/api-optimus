import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

export const isAuthAsAdmin: RequestHandler = (
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
    const payload = jwt.verify(token, jwtSecret) as {
      email: string;
      userType: string;
      iat: number;
      exp: number;
      sub: string;
    };

    if (payload.userType !== "Admin") {
      return res.status(401).json({
        message: "Unauthorized, user with access denied!",
      });
    }

    return next();
  } catch (error: any) {
    return res.status(401).json({
      message: "Unauthorized, token invalid!",
    });
  }
};
