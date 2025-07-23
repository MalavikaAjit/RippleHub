import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import { User } from "./models/user.model.js";
import chatRoutes from "./routes/chat.route.js";
import postInteractionRoutes from "./routes/postInteraction.routes.js";

import { Server } from "socket.io";
import http from "http";
import userRoutes from "./routes/user.route.js";
import { Message } from "./models/messageModel.js";
import friendRequestRoutes from "./routes/friendRequest.route.js";
import NotificationRoutes from "./routes/notification.route.js";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";

import postRoutes from "./routes/post.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 2057;

const server = http.createServer(app);
app.use(cors({ origin: "http://localhost:5173", credentials: true })); //allows us to make requests from the frontend to the backend

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});
export const socketServer = io;

app.use(express.json()); //allows us to parse incoming requests:req.body

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/profileUploads",
  express.static(path.join(__dirname, "../profileUploads"))
);

app.use("/uploads", express.static("uploads"));

app.use(cookieParser()); //allows us to parse cookies from incoming requests:req.cookies

app.use("/api/auth", authRoutes); //routes for api auth

app.use("/api", postRoutes);

app.use("/api/user", userRoutes); //routes for api user

app.use("/api/friend-request", friendRequestRoutes);

app.use("/api/notifications", NotificationRoutes);

app.use("/api/chat", chatRoutes); //routes for api chat

app.use("/api/", postInteractionRoutes);

// Serve 'uploads' folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// update user on Socket Events(Real-time online/offline status)
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join", async (userId) => {
    console.log(userId);
    socket.join(userId);
    await User.findByIdAndUpdate(userId, {
      isOnline: true,
      lastLogin: new Date(),
      socketId: socket.id,
    });
  });

  socket.on("send_message", async ({ sender, receiver, message }) => {
    try {
      const newMsg = await Message.create({
        sender,
        receiver,
        message,
        status: "sent",
      });

      // Emit to both sender and receiver
      io.to(receiver).emit("receive_message", newMsg);
      io.to(sender).emit("receive_message", newMsg);
    } catch (err) {
      console.error(" Error in socket send_message:", err);
    }
  });

  socket.on("seen_messages", async ({ sender, receiver }) => {
    const updated = await Message.updateMany(
      { sender, receiver, status: { $ne: "seen" } },
      { $set: { status: "seen" } }
    );

    io.to(sender).emit("messages_seen", { from: receiver });
  });

  socket.on("send_notification", ({ recipientId, notification }) => {
    io.to(recipientId).emit("receive_notification", notification);
  });

  socket.on("disconnect", async () => {
    await User.updateOne(
      { socketId: socket.id },
      { isOnline: false, socketId: null }
    );
    console.log("User disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port: ${PORT}`);
});

// app.listen(PORT, () => {
//   connectDB();
//   console.log("Server is Running on port: ", PORT);
// });
