import express from "express";

import {
  createUserLoRaSim,
  deleteUserLoRaSim,
  getUserLoRaSimById,
  getUserLoRaSims,
  updateUserLoRaSim,
} from "../controllers/UserLoRaSimulationController.js";

const router = express.Router();

router.get("/", getUserLoRaSims);
router.get("/:id", getUserLoRaSimById);
router.post("/", createUserLoRaSim);
router.put("/:id", updateUserLoRaSim);
router.delete("/:id", deleteUserLoRaSim);

export default router;
