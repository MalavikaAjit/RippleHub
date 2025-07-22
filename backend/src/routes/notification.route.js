import express from "express";
import {
  getNotifications,
  markAsRead,
} from "../controller/notification.controller.js";
import { protectAuth } from "../middleware/protectAuth.js";

const router = express.Router();

router.get("/", protectAuth, getNotifications);
router.patch("/mark-read/:id", protectAuth, markAsRead);

export default router;
