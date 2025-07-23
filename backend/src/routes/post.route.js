import express from "express";
import {
  postImageUpload,
  updateImageUpload,
} from "../middleware/multerConnection.js";
import {
  createPost,
  getPost,
  getPosts,
  deletePost,
  updatePost,
} from "../controller/post.controller.js";
import { protectAuth } from "../middleware/protectAuth.js"; //

const router = express.Router();

router.get("/posts", protectAuth, getPost);
router.post("/posts", protectAuth, postImageUpload, createPost);
router.get("/friends-feed", protectAuth, getPosts);

router.delete("/posts/:postId", protectAuth, deletePost);
// router.put("/posts/:postId", protectAuth, postImageUpload, updatePost);
router.put("/posts/:postId", protectAuth, updateImageUpload, updatePost);

export default router;
