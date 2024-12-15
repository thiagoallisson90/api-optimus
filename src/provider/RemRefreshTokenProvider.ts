import RefreshToken from "../models/RefreshTokenModel.js";

class RemRefreshTokenProvider {
  async execute(refresh_token: string) {
    const query = await RefreshToken.deleteMany({ id: refresh_token });
    return query.acknowledged != undefined;
  }
}

export { RemRefreshTokenProvider };
