import React, { useEffect, useState, useRef } from "react";
import { FaEnvelope, FaPaperPlane, FaCircle } from "react-icons/fa";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import { useSocketStore } from "../../store/socketStore";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const MessagePage = () => {
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageEndRef = useRef(null);

  const { user } = useAuthStore();
  const { socket } = useSocketStore();
  const { isDark } = useThemeStore();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("http://localhost:2057/api/user/all");
      const filtered = res.data.filter((u) => u._id !== user._id);
      setUsers(filtered);
    };
    if (user) fetchUsers();
  }, [user]);

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      const res = await axios.get(
        `http://localhost:2057/api/chat/${selectedChat._id}`
      );
      setMessages(res.data);

      socket.emit("seen_messages", {
        sender: selectedChat._id,
        receiver: user._id,
      });
    };

    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    if (!user || !socket) return;
    console.log("Joining socket room for user:", user._id);
    socket.emit("join", user._id);

    const onReceiveMessage = (msg) => {
      const chatId = selectedChat?._id;
      if (msg.sender === chatId || msg.receiver === chatId) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          return exists ? prev : [...prev, msg];
        });

        if (msg.sender === chatId) {
          socket.emit("seen_messages", {
            sender: chatId,
            receiver: user._id,
          });
        }
      }
    };

    const onSeen = ({ from }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          const senderId = msg.sender._id || msg.sender;
          const receiverId = msg.receiver._id || msg.receiver;
          if (
            senderId === user._id &&
            receiverId === from &&
            msg.status !== "seen"
          ) {
            return { ...msg, status: "seen" };
          }
          return msg;
        })
      );
    };

    const onDelivered = ({ to }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          const senderId = msg.sender._id || msg.sender;
          const receiverId = msg.receiver._id || msg.receiver;
          if (
            senderId === user._id &&
            receiverId === to &&
            msg.status === "sent"
          ) {
            return { ...msg, status: "delivered" };
          }
          return msg;
        })
      );
    };

    socket.on("receive_message", onReceiveMessage);
    socket.on("messages_seen", onSeen);
    socket.on("message_delivered", onDelivered);

    return () => {
      socket.off("receive_message", onReceiveMessage);
      socket.off("messages_seen", onSeen);
      socket.off("message_delivered", onDelivered);
    };
  }, [user, socket, selectedChat]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    socket.emit("send_message", {
      sender: user._id,
      receiver: selectedChat._id,
      message: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div
      className={`flex h-screen overflow-hidden rounded-md shadow transition-colors ${
        isDark ? "bg-[#121212] text-white" : "bg-[#f3f6fa] text-gray-800"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`overflow-y-auto resize-x border-r transition-colors ${
          isDark ? "bg-[#1e1e1e] border-gray-700" : "bg-white border-gray-200"
        }`}
        style={{ minWidth: "300px", maxWidth: "500px", width: "400px" }}
      >
        <div
          className={`p-4 flex items-center gap-3 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <FaEnvelope className="text-[#288683]" />
          <h2
            className={`text-lg font-semibold ${
              isDark ? "text-[#27b1ab]" : "text-[#1c5e5a]"
            }`}
          >
            Messages
          </h2>
        </div>
        <div>
          {users.map((u) => (
            <div
              key={u._id}
              onClick={() => setSelectedChat(u)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                selectedChat?._id === u._id
                  ? isDark
                    ? "bg-[#2a2a2a]"
                    : "bg-gray-100"
                  : isDark
                  ? "hover:bg-[#1f1f1f]"
                  : "hover:bg-gray-50"
              }`}
            >
              <img
                src={`https://i.pravatar.cc/150?u=${u._id}`}
                alt={u.firstName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4
                  className={`font-medium text-sm flex items-center gap-2 ${
                    isDark ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  {u.firstName} {u.lastName}{" "}
                  {u.isOnline && (
                    <FaCircle className="text-green-500 text-[10px]" />
                  )}
                </h4>
                <p
                  className={`text-xs truncate ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {u.lastMessage || "No messages yet"}
                </p>
              </div>
              <span
                className={`text-xs whitespace-nowrap ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {!u.isOnline && u.lastOnlineAt
                  ? formatDistanceToNow(new Date(u.lastOnlineAt), {
                      addSuffix: true,
                    })
                  : ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      <div
        className={`flex-1 flex flex-col transition-colors ${
          isDark ? "bg-[#1e1e1e]" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center gap-3 p-3 border-b ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          {selectedChat && (
            <>
              <img
                src={`https://i.pravatar.cc/150?u=${selectedChat._id}`}
                alt="Chat"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col">
                <h4
                  className={`text-base font-semibold ${
                    isDark ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  {selectedChat.firstName} {selectedChat.lastName}
                </h4>
                <span
                  className={`text-xs flex items-center gap-1 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {selectedChat.isOnline ? (
                    <>
                      <FaCircle className="text-green-500 text-[10px]" /> Online
                    </>
                  ) : selectedChat.lastOnlineAt ? (
                    formatDistanceToNow(new Date(selectedChat.lastOnlineAt), {
                      addSuffix: true,
                    })
                  ) : (
                    "Offline"
                  )}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
          {messages.map((msg, idx) => {
            const isSender = (msg.sender._id || msg.sender) === user._id;
            const isLastSentByMe =
              isSender &&
              messages
                .slice()
                .reverse()
                .find((m) => (m.sender._id || m.sender) === user._id)?._id ===
                msg._id;

            return (
              <div key={msg._id || idx}>
                <div
                  className={`max-w-[40%] break-words p-3 rounded-lg text-sm shadow-md ${
                    isSender
                      ? "bg-[#288683] text-white ml-auto"
                      : isDark
                      ? "bg-[#2a2a2a] text-gray-100"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.message}
                </div>
                {isLastSentByMe && (
                  <div className="text-[10px] text-right text-gray-400 pr-1 mt-0.5">
                    {msg.status === "seen"
                      ? "Seen"
                      : msg.status === "delivered"
                      ? "Delivered"
                      : "Sent"}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messageEndRef}></div>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className={`flex items-center gap-3 p-4 border-t transition-colors ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className={`flex-1 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#288683] ${
              isDark
                ? "bg-[#2a2a2a] text-gray-100 border border-gray-600"
                : "bg-white text-gray-800 border border-gray-300"
            }`}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#288683] text-white rounded-md hover:bg-opacity-90"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagePage;
