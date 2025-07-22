import express from "express";
import { getMessages } from "../controller/chat.controller.js";
import { protectAuth } from "../middleware/protectAuth.js";

const router = express.Router();

router.get("/:userId", protectAuth, getMessages);

export default router;
