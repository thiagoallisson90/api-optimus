import UserModel from "../../models/UserModel.js";
import { hash } from "node:crypto";
import { GenerateRefreshToken } from "../../provider/GenerateRefreshToken.js";
import { GenerateTokenProvider } from "../../provider/GenerateTokenProvider.js";

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

    // Generate user token
    const generateTokeProvider = new GenerateTokenProvider();
    const token = await generateTokeProvider.execute(userAlreadyExist);

    const generateRefreshToken = new GenerateRefreshToken();
    const refreshToken = await generateRefreshToken.execute(userAlreadyExist);

    return { token, refreshToken };
  }
}

export { AuthenticateUserUseCase };
