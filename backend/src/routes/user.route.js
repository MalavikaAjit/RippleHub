import express from "express";
import { getAllUsers } from "../controller/user.controller.js";
import { protectAuth } from "../middleware/protectAuth.js";
import { getFriendList } from "../controller/user.controller.js";

const router = express.Router();

router.get("/all", protectAuth, getAllUsers);
router.get("/friends", protectAuth, getFriendList);

export default router;
