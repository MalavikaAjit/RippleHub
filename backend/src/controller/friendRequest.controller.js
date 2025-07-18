import { FriendRequest } from "../models/friendRequest.model.js";
import { Notification } from "../models/notification.model.js";
import { socketServer } from "../index.js";
import { User } from "../models/user.model.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const sender = req.userId;
    const { receiver } = req.body;

    const exists = await FriendRequest.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
      status: "pending",
    });

    if (exists) {
      return res.status(400).json({ error: "Friend request already exists" });
    }

    const request = await FriendRequest.create({ sender, receiver });

    const senderUser = await User.findById(sender).select("firstName lastName");
    if (!senderUser) return res.status(404).json({ error: "Sender not found" });

    const notification = await Notification.create({
      recipient: receiver,
      type: "friend_request",
      message: `${senderUser.firstName} ${senderUser.lastName} sent you a friend request.`,
      requestId: request._id,
    });

    socketServer.to(receiver).emit("receive_notification", notification);
    res.status(201).json(request);
  } catch (err) {
    console.error("Error sending friend request:", err);
    res.status(500).json({ error: "Failed to send friend request" });
  }
};

export const getMyRequests = async (req, res) => {
  const userId = req.userId;

  const requests = await FriendRequest.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate("sender", "firstName lastName")
    .populate("receiver", "firstName lastName");

  res.status(200).json(requests);
};

export const respondToFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body;
    const receiverId = req.userId;

    const request = await FriendRequest.findById(requestId).populate(
      "sender receiver"
    );
    if (!request) return res.status(404).json({ error: "Request not found" });

    if (request.receiver._id.toString() !== receiverId)
      return res.status(403).json({ error: "Not authorized" });

    request.status = action === "accept" ? "accepted" : "declined";
    await request.save();

    if (action === "accept") {
      const senderUser = await User.findById(request.sender._id);
      const receiverUser = await User.findById(request.receiver._id);

      if (!senderUser || !receiverUser)
        return res.status(404).json({ error: "Sender or receiver not found" });

      // Add each other to friends list
      if (!Array.isArray(senderUser.friends)) senderUser.friends = [];
      if (!Array.isArray(receiverUser.friends)) receiverUser.friends = [];

      if (!senderUser.friends.includes(receiverUser._id)) {
        senderUser.friends.push(receiverUser._id);
        await senderUser.save();
      }

      if (!receiverUser.friends.includes(senderUser._id)) {
        receiverUser.friends.push(senderUser._id);
        await receiverUser.save();
      }

      // Create notification only for sender
      const existingNotification = await Notification.findOne({
        recipient: senderUser._id,
        type: "friend_accept",
        requestId: request._id,
      });

      if (!existingNotification) {
        const notification = await Notification.create({
          recipient: senderUser._id, // This ensures only the sender sees it
          type: "friend_accept",
          message: `You are now friends with ${receiverUser.firstName} ${receiverUser.lastName}.`,
          requestId: request._id,
        });

        socketServer
          .to(senderUser._id.toString()) //Emit only to sender
          .emit("receive_notification", notification);
      }
    }

    res.status(200).json({ success: true, updatedRequest: request });
  } catch (error) {
    console.error("Error responding to friend request:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const cancelRequest = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const request = await FriendRequest.findById(id);
  if (!request) return res.status(404).json({ error: "Request not found" });

  if (request.sender.toString() !== userId) {
    return res
      .status(403)
      .json({ error: "Not allowed to cancel this request" });
  }

  // Delete associated friend_request notification
  await Notification.deleteOne({
    requestId: request._id,
    type: "friend_request",
  });

  // (Optional) Notify the receiver in real-time to remove it from UI
  socketServer.to(request.receiver.toString()).emit("remove_notification", {
    requestId: request._id,
    type: "friend_request",
  });

  await request.deleteOne();

  res.status(200).json({ message: "Request cancelled" });
};
