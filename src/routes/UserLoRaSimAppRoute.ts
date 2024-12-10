import express from "express";

import {
  getAppByLoRaSimId,
  getApps,
} from "../controllers/UserLoRaSimAppController.js";

const router = express.Router();

router.get("/", getApps);
router.get("/:id", getAppByLoRaSimId);

export default router;
