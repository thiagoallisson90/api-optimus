import { Request, Response } from "express";
import { RefreshTokenUserUseCase } from "./RefreshTokenUserUseCase.js";

class RefreshTokenUserController {
  async handle(req: Request, res: Response): Promise<any> {
    const { refresh_token } = req.body as {
      refresh_token: string;
    };

    const refreshTokenUserUseCase = new RefreshTokenUserUseCase();
    const { token, newRefreshToke } = await refreshTokenUserUseCase.execute(
      refresh_token
    );

    return res.json(token);
  }
}

export { RefreshTokenUserController };
