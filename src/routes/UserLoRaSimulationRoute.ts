import express from "express";

import {
  createUserLoRaSim,
  deleteUserLoRaSim,
  getUserLoRaSimById,
  getUserLoRaSimByUser,
  getUserLoRaSims,
  updateUserLoRaSim,
} from "../controllers/UserLoRaSimulationController.js";

const router = express.Router();

router.get("/", getUserLoRaSims);
router.get("/:id", getUserLoRaSimById);
router.get("/user/:user", getUserLoRaSimByUser);
router.post("/", createUserLoRaSim);
router.put("/:id", updateUserLoRaSim);
router.delete("/:id", deleteUserLoRaSim);

export default router;
