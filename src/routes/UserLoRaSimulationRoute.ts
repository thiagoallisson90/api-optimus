import express from "express";

import {
  createUserLoRaSim,
  deleteUserLoRaSim,
  getUserLoRaSimById,
  getUserLoRaSimByUser,
  getUserLoRaSims,
  updateUserLoRaSim,
} from "../controllers/UserLoRaSimulationController.js";
import { isAuthAsAdmin } from "../middleware/user/isAuthAsAdmin.js";
import { isAuthAsMember } from "../middleware/user/isAuthAsMember.js";
import { isAuth } from "../middleware/user/isAuth.js";

const router = express.Router();

router.get("/", isAuthAsAdmin, getUserLoRaSims);

router.get("/:id", isAuthAsMember, getUserLoRaSimById);
router.put("/:id", isAuthAsMember, updateUserLoRaSim);
router.delete("/:id", isAuthAsMember, deleteUserLoRaSim);

router.get("/user/:user", isAuthAsMember, getUserLoRaSimByUser);

router.post("/", isAuth, createUserLoRaSim);

export default router;
