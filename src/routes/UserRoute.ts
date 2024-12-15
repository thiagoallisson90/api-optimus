import express from "express";

import {
  createUser,
  deleteUser,
  getUsers,
  login,
  updateUser,
} from "../controllers/UserController.js";
import { ensureAuthenticated } from "../middleware/ensureAuthenticated.js";
import { RefreshTokenUserController } from "../useCases/refreshTokenUser/RefreshTokenUserController.js";

const refreshTokenUserController = new RefreshTokenUserController();

const router = express.Router();

router.post("/login", login);
router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/refresh-token", refreshTokenUserController.handle);

router.get("/simulation", ensureAuthenticated, (req, res) => {
  res.status(200).json([
    {
      id: 1,
      name: "NodeJS",
    },
    {
      id: 2,
      name: "ReactJS",
    },
    {
      id: 3,
      name: "React Native",
    },
    {
      id: 4,
      name: "Elixir",
    },
  ]);
});

export default router;
