import { Post } from '../models/post.model.js';

export const createPost = async (req, res, next) => {
  try {
    const { caption, privacy } = req.body;
    const userId = req.userId;
    const imagePaths = req.imagePaths;

    if (!imagePaths || imagePaths.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    const newPost = new Post({
      userId,
      post_image: imagePaths,
      caption,
      privacy,
    });
    await newPost.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    console.error('createPost error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getPost = async (req, res) => {
  try {
    const userId = req.userId;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    console.log("Posts fetched:", posts);
    res.status(200).json({ success: true, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
};
