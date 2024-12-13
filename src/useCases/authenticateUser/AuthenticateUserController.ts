import { Request, Response } from "express";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase.js";

class AuthenticateUserController {
  handle(req: Request, res: Response) {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const authenticateUserUseCase = new AuthenticateUserUseCase();
    return authenticateUserUseCase.execute({ email, password });
  }
}

export { AuthenticateUserController };
