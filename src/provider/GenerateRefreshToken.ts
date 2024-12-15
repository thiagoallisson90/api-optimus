import dayjs from "dayjs";
import RefreshToken from "../models/RefreshTokenModel.js";
import { IUserModel } from "../models/UserModel.js";
import mongoose from "mongoose";

class GenerateRefreshToken {
  async execute(user: IUserModel) {
    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      throw new Error("User id is invalid!");
    }

    const expiresInForRefreshToken = process.env.EXPIRE_REFRESH_TOKEN
      ? parseInt(process.env.EXPIRE_REFRESH_TOKEN)
      : 30;

    const expiresIn = dayjs().add(expiresInForRefreshToken, "second").unix();

    const refreshToken = await new RefreshToken({
      expiresIn,
      user,
      /*userId: user.id,*/
    }).save();

    return refreshToken.id;
  }
}

export { GenerateRefreshToken };
