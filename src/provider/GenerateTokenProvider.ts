import jwt from "jsonwebtoken";
import { IUserModel } from "../models/UserModel.js";

class GenerateTokenProvider {
  async execute(user: IUserModel) {
    const jwtSecret = process.env.JWT_SECRET || "123@";
    const { id, email, password } = user;

    const token = jwt.sign({ email, password }, jwtSecret, {
      subject: id,
      expiresIn: "20s",
    });

    return token;
  }
}

export { GenerateTokenProvider };
