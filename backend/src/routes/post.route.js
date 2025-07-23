import express from 'express';
import { postImageUpload } from '../middleware/multerConnection.js'; // Adjust path to your middleware
import { createPost, getPost } from '../controller/post.controller.js'; // Adjust path to your controller

const router = express.Router();

// Route for creating a post with image(s)

router.get ('/posts',getPost);
router.post('/posts', postImageUpload, createPost);

export default router;