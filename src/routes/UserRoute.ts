import express from "express";

import {
  createUser,
  deleteUser,
  getUsers,
  login,
  updateUser,
} from "../controllers/UserController.js";
//import { RefreshTokenUserController } from "../useCases/refreshTokenUser/RefreshTokenUserController.js";
import { isAuthAsAdmin } from "../middleware/isAuthAsAdmin.js";

// const refreshTokenUserController = new RefreshTokenUserController();

const router = express.Router();

// Admin User
router.get("/", isAuthAsAdmin, getUsers);

// Admin or Member User
router.post("/login", login);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
/*router.post("/refresh-token", refreshTokenUserController.handle);

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
});*/

export default router;
