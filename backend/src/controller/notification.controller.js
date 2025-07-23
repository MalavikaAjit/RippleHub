import { Notification } from "../models/notification.model.js";
import { FriendRequest } from "../models/friendRequest.model.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    //Enrich with friend request status (accepted/declined)
    const enriched = await Promise.all(
      notifications.map(async (n) => {
        if (n.requestId && n.type === "friend_request") {
          const req = await FriendRequest.findById(n.requestId);
          return {
            ...n,
            responded: req?.status || null,
          };
        }
        return n;
      })
    );

    res.status(200).json(enriched);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ error: "Not found" });
    notification.isRead = true;
    await notification.save();
    res.status(200).json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update" });
  }
};
