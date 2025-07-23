import express from 'express';
import { postImageUpload } from '../middleware/multerConnection.js';
import { createPost, getPost } from '../controller/post.controller.js';
import { protectAuth } from '../middleware/protectAuth.js'; // 

const router = express.Router();

router.get('/posts', protectAuth, getPost);
router.post('/posts', protectAuth, postImageUpload, createPost);

export default router;
