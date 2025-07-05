import { Post } from '../models/post.model.js'; // Adjust path to your Post model
// import {postImageUpload} from '../middleware/multerConnection.js';
export const createPost = async (req, res, next) => {
  try {
    // Extract data from request
    const { caption, privacy } = req.body;
    const imagePaths = req.imagePaths; // From middleware

    // Create new post
    const newPost = new Post({
      post_image: imagePaths[0], // Store first image path (modify schema if storing multiple images)
      caption,
      privacy
    });

    await newPost.save();

    res.status(201).json({
      message: 'Post created successfully',
      post: newPost
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async(req,res,next) =>{
  try {
     const posts = await Post.find().sort({createdAt : -1});
     res.status(200).json(posts);
  }catch (error){
    console.error("Error fetching posts :", error);
    res.status(500).json({error : "Failed to fetch posts"});
  }
};