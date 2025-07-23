import { Message } from "../models/messageModel.js";
import { FriendRequest } from "../models/friendRequest.model.js";
import { User } from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.userId;
    // TODO : find  exiting friends
    const users = await User.find({ _id: { $ne: currentUserId } });

    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const sentRequest = await FriendRequest.findOne({
          sender: currentUserId,
          receiver: user._id,
        });

        const receivedRequest = await FriendRequest.findOne({
          sender: user._id,
          receiver: currentUserId,
        });

        let friendRequestStatus = null;
        let requestDirection = null;
        let requestId = null;

        if (sentRequest && sentRequest.status === "pending") {
          friendRequestStatus = "pending";
          requestDirection = "sent";
          requestId = sentRequest._id;
        } else if (receivedRequest && receivedRequest.status === "pending") {
          friendRequestStatus = "pending";
          requestDirection = "received";
          requestId = receivedRequest._id;
        }
        const lastMessage = await Message.findOne({
          $or: [
            { sender: currentUserId, receiver: user._id },
            { sender: user._id, receiver: currentUserId },
          ],
        })
          .sort({ createdAt: -1 })
          .lean();

        return {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isOnline: user.isOnline,
          friendRequestStatus,
          requestDirection,
          requestId,
          lastMessage: lastMessage?.message || null,
          lastMessageAt: lastMessage?.createdAt || null,
          profileImage: user.profileImage,
        };
      })
    );

    res.status(200).json(enrichedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getFriendList = async (req, res) => {
  try {
    const userId = req.userId;

    const acceptedRequests = await FriendRequest.find({
      $or: [
        { sender: userId, status: "accepted" },
        { receiver: userId, status: "accepted" },
      ],
    }).populate("sender receiver", "firstName lastName");

    const friends = acceptedRequests.map((req) =>
      req.sender._id.toString() === userId.toString()
        ? req.receiver
        : req.sender
    );

    res.status(200).json(friends);
  } catch (error) {
    console.error("Error fetching friends list:", error);
    res.status(500).json({ error: "Failed to fetch friends" });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const bio = req.body.bio;
    const profileImage = req.file
      ? `/profileUploads/${req.file.filename}`
      : null;

    const updateData = {};
    if (bio) updateData.bio = bio;
    if (profileImage) updateData.profileImage = profileImage;

    const updated = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};
