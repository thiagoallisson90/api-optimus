import express from "express";

import {
  createProfile,
  deleteProfile,
  getProfileById,
  getProfileByUser,
  getProfiles,
  updateProfile,
} from "../controllers/ProfileController.js";

const router = express.Router();

router.get("/", getProfiles);
router.get("/:id", getProfileById);
router.get("/user/:user", getProfileByUser);
router.post("/", createProfile);
router.put("/:id", updateProfile);
router.delete("/:id", deleteProfile);

export default router;
