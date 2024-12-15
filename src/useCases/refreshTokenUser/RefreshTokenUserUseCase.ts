import dayjs from "dayjs";
import RefreshToken from "../../models/RefreshTokenModel.js";
import User from "../../models/UserModel.js";
import { GenerateTokenProvider } from "../../provider/GenerateTokenProvider.js";
import { GenerateRefreshToken } from "../../provider/GenerateRefreshToken.js";

class RefreshTokenUserUseCase {
  async execute(refresh_token: string) {
    const refreshToken = await RefreshToken.findById(refresh_token);

    if (!refreshToken) {
      throw new Error("Refresh token invalid!");
    }

    const user = await User.findById(refreshToken.user.toString());
    if (!user) {
      throw new Error("User is invalid!");
    }

    const refreshTokenExpired = dayjs().isAfter(
      dayjs.unix(refreshToken.expiresIn)
    );

    if (refreshTokenExpired) {
      await RefreshToken.deleteMany({ user: refreshToken.user });
      const generateRefreshToken = new GenerateRefreshToken();
      const newRefreshToken = await generateRefreshToken.execute(user);

      const generateTokenProvider = new GenerateTokenProvider();
      const token = await generateTokenProvider.execute(user);

      return { token, refreshToken: newRefreshToken };
    }

    const generateTokenProvider = new GenerateTokenProvider();
    const token = await generateTokenProvider.execute(user);

    return { token };
  }
}

export { RefreshTokenUserUseCase };
