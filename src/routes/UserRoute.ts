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
router.post("/refresh-token", refreshTokenUserController.handle);
router.post("/signup", createUser);

// Admin Users
router.get("/", isAuthAsAdmin, getUsers);
router.post("/", isAuthAsAdmin, createUser);

// Admin or Member Users
router.put("/:email", isAuthAsMember, updateUser);
router.delete("/:email", isAuthAsMember, deleteUser);
router.post("/logout", isAuthAsMember, logout);

export default router;
