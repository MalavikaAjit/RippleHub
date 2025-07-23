import express from "express";
import { getAllUsers } from "../controller/user.controller.js";
import { updateUserProfile } from "../controller/user.controller.js";
import { protectAuth } from "../middleware/protectAuth.js";
import { getFriendList } from "../controller/user.controller.js";
import { profileUploads } from "../middleware/upload.js";
import { getProfile } from "../controller/user.controller.js";

const router = express.Router();

router.get("/all", protectAuth, getAllUsers);
router.get("/friends", protectAuth, getFriendList);

router.put(
  "/update-profile",
  protectAuth,
  profileUploads.single("profileImage"),
  updateUserProfile
);

router.get("/profile/:id", protectAuth, getProfile);

export default router;
