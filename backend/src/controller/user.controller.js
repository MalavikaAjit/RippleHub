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

        return {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isOnline: user.isOnline,
          friendRequestStatus,
          requestDirection,
          requestId,
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
