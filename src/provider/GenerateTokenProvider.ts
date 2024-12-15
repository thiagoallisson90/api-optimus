import jwt from "jsonwebtoken";
import { IUserModel } from "../models/UserModel.js";
import { randomUUID } from "node:crypto";

class GenerateTokenProvider {
  async execute(user: IUserModel) {
    const jwtSecret = process.env.JWT_SECRET || randomUUID();
    const { id, name, email, userType } = user;

    const expiresInForToken = process.env.EXPIRE_TOKEN || "1800";

    const token = jwt.sign({ name, email, userType }, jwtSecret, {
      subject: id,
      expiresIn: `${expiresInForToken}s`,
    });

    return token;
  }
}

export { GenerateTokenProvider };
