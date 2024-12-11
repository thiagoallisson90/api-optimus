import express from "express";

import {
  createUserLoRaSim,
  deleteUserLoRaSim,
  getUserLoRaSim,
  getUserLoRaSims,
  updateUserLoRaSim,
} from "../controllers/UserLoRaSimulationController.js";

const router = express.Router();

router.get("/", getUserLoRaSims);
router.get("/:id", getUserLoRaSim);
router.post("/", createUserLoRaSim);
router.put("/:id", updateUserLoRaSim);
router.delete("/:id", deleteUserLoRaSim);

export default router;
