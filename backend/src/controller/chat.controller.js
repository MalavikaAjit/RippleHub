import { Message } from "../models/messageModel.js";
import mongoose from "mongoose";

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.userId;

    if (
      !mongoose.Types.ObjectId.isValid(myId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const senderId = new mongoose.Types.ObjectId(myId);
    const receiverId = new mongoose.Types.ObjectId(userId);

    // Update messages as "seen"
    await Message.updateMany(
      // { receiver: senderId, sender: receiverId, status: { $ne: "seen" } },
      { receiver: receiverId, sender: senderId, status: { $ne: "seen" } },
      { $set: { status: "seen" } }
    );

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "firstName lastName")
      .populate("receiver", "firstName lastName");

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error in getMessages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
