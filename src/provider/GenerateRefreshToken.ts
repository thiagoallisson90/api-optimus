import dayjs from "dayjs";
import RefreshToken from "../models/RefreshTokenModel.js";
import User from "../models/UserModel.js";
import mongoose from "mongoose";

class GenerateRefreshToken {
  async execute(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("User id is invalid!");
    }

    const expiresIn = dayjs().add(20, "second").unix();

    const user = await User.findById(userId);

    const refreshToken = await new RefreshToken({
      expiresIn,
      user,
    }).save();

    return refreshToken;
  }
}

export { GenerateRefreshToken };
