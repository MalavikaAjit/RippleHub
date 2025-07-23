import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";

export const toggleLike = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    const existing = await Like.findOne({ user: userId, post: postId });

    let liked = false;
    if (existing) {
      await existing.deleteOne();
    } else {
      await Like.create({ user: userId, post: postId });
      liked = true;
    }

    // This must come after the toggle
    const likesCount = await Like.countDocuments({ post: postId });

    return res.status(200).json({
      liked,
      likesCount, //Confirm this is included
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ error: "Failed to toggle like" });
  }
};

export const addComment = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;
    const { text } = req.body;

    const comment = await Comment.create({ user: userId, post: postId, text });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

export const getPostInteractions = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 });

    const isLiked = await Like.exists({ post: postId, user: userId });

    res.status(200).json({
      isLiked: !!isLiked,
      comments,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch interactions" });
  }
};
