import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

const operationsToCheckForMember = ["DELETE", "GET", "PUT"];

export const isAuthAsMember: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({
      ok: false,
      message: "Unauthorized, token is missing!",
    });
  }

  const [, token] = authToken.split(" ");

  try {
    const jwtSecret = process.env.JWT_SECRET || "123@";
    const payload = jwt.verify(token, jwtSecret) as {
      name: string;
      email: string;
      userType: string;
      iat: number;
      exp: number;
      sub: string;
    };

    if (
      payload.userType === "Member" &&
      operationsToCheckForMember.indexOf(req.method) !== -1
    ) {
      if (req.params.email !== payload.email) {
        return res.status(401).json({
          ok: false,
          message: "Unauthorized, user with access denied!",
        });
      }
    }

    return next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Unauthorized, token invalid!",
    });
  }
};
