import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { FriendRequest } from "../models/friendRequest.model.js";

export const createPost = async (req, res, next) => {
  try {
    const { caption, privacy } = req.body;
    const userId = req.userId;
    const imagePaths = req.imagePaths;

    if (!imagePaths || imagePaths.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
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
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("createPost error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPost = async (req, res) => {
  try {
    const userId = req.userId;
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const userIdStr = req.userId.toString();

    const acceptedFriendRequests = await FriendRequest.find({
      $or: [
        { sender: req.userId, status: "accepted" },
        { receiver: req.userId, status: "accepted" },
      ],
    });

    const friendIds = acceptedFriendRequests.map((fr) =>
      fr.sender.toString() === userIdStr ? fr.receiver : fr.sender
    );

    const posts = await Post.find({ userId: { $in: friendIds } })
      .sort({ createdAt: -1 })
      .populate("userId", "firstName lastName, profileImage");

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Ensure the user owns the post
    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Post.findByIdAndDelete(postId);

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete Post Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is missing" });
    }

    const caption = req.body.caption ?? ""; // ensure it's at least an empty string
    let existing = [];

    if (req.body.imagePaths) {
      try {
        existing = JSON.parse(req.body.imagePaths);
      } catch (err) {
        return res.status(400).json({ message: "Invalid imagePaths format" });
      }
    }

    const newImages = req.files?.map((f) => f.filename) || [];

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        caption,
        post_image: [...existing, ...newImages],
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ updatedPost });
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Server error" });
  }
};
