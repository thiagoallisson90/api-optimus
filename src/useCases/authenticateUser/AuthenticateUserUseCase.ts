import UserModel from "../../models/UserModel.js";
import { hash } from "node:crypto";
import jwt from "jsonwebtoken";

interface IRequest {
  email: string;
  password: string;
}

const compare = (passwordClear: string, passwordHash: string): boolean => {
  return hash("sha256", passwordClear) === passwordHash;
};

class AuthenticateUserUseCase {
  async execute({ email, password }: IRequest) {
    // Check if user exists
    const userAlreadyExist = await UserModel.findOne({
      email,
    });

    if (!userAlreadyExist) {
      throw new Error("User or password incorrect!");
    }

    // Check if password is correct
    if (!compare(password, userAlreadyExist.password)) {
      throw new Error("User or password incorrect!");
    }

    const jwtSecret = process.env.JWT_SECRET || "123@";

    // Generate user token
    return jwt.sign({ email, password }, jwtSecret, {
      expiresIn: "300s",
    });
  }
}

export { AuthenticateUserUseCase };
