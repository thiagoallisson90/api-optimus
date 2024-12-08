import express from "express";

import {
  createProfile,
  deleteProfile,
  getProfiles,
  updateProfile,
} from "../controllers/ProfileController.js";

const router = express.Router();

router.get("/", getProfiles);
router.post("/", createProfile);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);

export default router;
