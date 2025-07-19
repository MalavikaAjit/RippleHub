import express from "express";
import {
  toggleLike,
  addComment,
  getPostInteractions,
} from "../controller/postInteraction.controller.js";
import { protectAuth } from "../middleware/protectAuth.js";

const router = express.Router();

router.post("/like/:postId", protectAuth, toggleLike);
router.post("/comment/:postId", protectAuth, addComment);
router.get("/interactions/:postId", protectAuth, getPostInteractions);

export default router;
