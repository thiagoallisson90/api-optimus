import express from "express";

import {
  createApp,
  getAppByLoRaSimId,
  getApps,
} from "../controllers/UserLoRaSimAppController.js";

const router = express.Router();

router.get("/", getApps);
router.get("/:id", getAppByLoRaSimId);
router.post("/", createApp);

export default router;
