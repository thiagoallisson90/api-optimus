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
import { isAuthAsAdmin } from "../middleware/user/isAuthAsAdmin.js";
import { isAuthAsMember } from "../middleware/user/isAuthAsMember.js";

const refreshTokenUserController = new RefreshTokenUserController();

const router = express.Router();

// Without Auth
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshTokenUserController.handle);
router.post("/signup", createUser);

// Admin Users
router.get("/", isAuthAsAdmin, getUsers);
router.post("/", isAuthAsAdmin, createUser);

// Admin or Member Users
router.put("/:id", isAuthAsMember, updateUser);
router.delete("/:id", isAuthAsMember, deleteUser);

export default router;
