import express from "express";

import {
  createApp,
  deleteApp,
  getAppByLoRaSimId,
  getApps,
  updateApp,
} from "../controllers/UserLoRaSimAppController.js";

const router = express.Router();

router.get("/", getApps);
router.get("/:id", getAppByLoRaSimId);
router.post("/", createApp);
router.put("/:id", updateApp);
router.delete("/:id", deleteApp);

export default router;
