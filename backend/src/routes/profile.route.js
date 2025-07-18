import express from "express";
import { createProfile, getMyProfile } from "../controller/profile.controller.js";
import { protectAuth } from "../middleware/protectAuth.js";

const router = express.Router();

// router.post("/profile", protectAuth, profileImageUpload , createProfile);
router.get("/getprofile", protectAuth, getMyProfile);

export default router;
