import express from "express";

import {
  createUser,
  deleteUser,
  getUsers,
  login,
  logout,
  updateUser,
} from "../controllers/UserController.js";
import { RefreshTokenUserController } from "../useCases/refreshTokenUser/RefreshTokenUserController.js";
import { isAuthAsAdmin } from "../middleware/isAuthAsAdmin.js";

const refreshTokenUserController = new RefreshTokenUserController();

const router = express.Router();

// Admin User
router.get("/", isAuthAsAdmin, getUsers);

// Admin or Member User
router.post("/login", login);
router.post("/logout", logout);

router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/refresh-token", refreshTokenUserController.handle);

export default router;
