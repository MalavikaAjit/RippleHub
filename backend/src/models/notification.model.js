import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "comment", "friend_request", "friend_accept"],
      required: true,
    },
    message: String,
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FriendRequest",
    },
    data: Object,
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
