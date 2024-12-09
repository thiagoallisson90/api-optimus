import express from "express";

import {
  createUserLoRaSim,
  deleteUserLoRaSim,
  getUserLoRaSim,
  updateUserLoRaSim,
} from "../controllers/UserLoRaSimulationController.js";

const router = express.Router();

router.get("/", getUserLoRaSim);
router.post("/", createUserLoRaSim);
router.put("/:id", updateUserLoRaSim);
router.delete("/:id", deleteUserLoRaSim);

export default router;
