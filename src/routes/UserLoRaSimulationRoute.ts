import express from "express";

import {
  createUserLoRaSim,
  deleteUserLoRaSim,
  getUserLoRaSimById,
  getUserLoRaSimByUser,
  getUserLoRaSims,
  updateUserLoRaSim,
  runSimulation,
} from "../controllers/UserLoRaSimulationController.js";
import { isAuthAsAdmin } from "../middleware/user/isAuthAsAdmin.js";
import { isAuthAsMember } from "../middleware/user/isAuthAsMember.js";
import { isAuth } from "../middleware/user/isAuth.js";

const router = express.Router();

router.get("/", isAuthAsAdmin, getUserLoRaSims);

router.get("/:id", getUserLoRaSimById);
router.put("/:id", updateUserLoRaSim);
router.delete("/:id", deleteUserLoRaSim);
router.get("/user/:email", getUserLoRaSimByUser);

// Here
router.post("/", isAuth, createUserLoRaSim);
router.put("/run/:id", isAuth, runSimulation);

export default router;
