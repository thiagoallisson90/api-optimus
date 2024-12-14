import RefreshToken from "../../models/RefreshTokenModel.js";

class RefreshTokenUserUseCase {
  async execute(refresh_token: string) {
    const refreshToken = await RefreshToken.findById(refresh_token);

    if (!refreshToken) {
      throw new Error("Refresh token invalid!");
    }
  }
}

export { RefreshTokenUserUseCase };
