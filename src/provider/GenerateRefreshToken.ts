import dayjs from "dayjs";
import RefreshToken from "../models/RefreshTokenModel.js";
import { IUserModel } from "../models/UserModel.js";
import mongoose from "mongoose";

class GenerateRefreshToken {
  async execute(user: IUserModel) {
    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      throw new Error("User id is invalid!");
    }

    const expiresIn = dayjs().add(20, "second").unix();

    const refreshToken = await new RefreshToken({
      expiresIn,
      user,
    }).save();

    return refreshToken.id;
  }
}

export { GenerateRefreshToken };
