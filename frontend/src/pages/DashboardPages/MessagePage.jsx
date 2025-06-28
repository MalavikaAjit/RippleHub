import React, { useState } from "react";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { useThemeStore } from "../../store/themeStore";

const chatUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "Hey! Did you see the new Ripple?",
    time: "2 mins ago",
  },
  {
    id: 2,
    name: "Sophie Lee",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Yes! That was amazing 👏",
    time: "10 mins ago",
  },
  {
    id: 3,
    name: "Mike Brown",
    avatar: "https://i.pravatar.cc/150?img=3",
    lastMessage: "I left a comment on your post!",
    time: "1 hour ago",
  },
];

const dummyConversation = {
  1: [
    { sender: "Alex Johnson", text: "Hey! Did you see the new Ripple?" },
    { sender: "You", text: "Yeah! That was awesome 👏" },
    { sender: "Alex Johnson", text: "I'm thinking of making one too!" },
  ],
  2: [
    { sender: "Sophie Lee", text: "Yes! That was amazing 👏" },
    { sender: "You", text: "Thanks Sophie 😄" },
  ],
  3: [
    { sender: "Mike Brown", text: "I left a comment on your post!" },
    { sender: "You", text: "I saw it! Thanks for the support!" },
  ],
};

const MessagePage = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const { isDark } = useThemeStore();
  const currentConversation = dummyConversation[selectedChat] || [];

  return (
    <div
      className={`flex h-screen overflow-hidden rounded-md shadow transition-colors ${
        isDark ? "bg-[#121212] text-white" : "bg-[#f3f6fa] text-gray-800"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`overflow-y-auto resize-x border-r transition-colors
        ${
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
          {chatUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedChat(user.id)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors
                ${
                  selectedChat === user.id
                    ? isDark
                      ? "bg-[#2a2a2a]"
                      : "bg-gray-100"
                    : isDark
                    ? "hover:bg-[#1f1f1f]"
                    : "hover:bg-gray-50"
                }`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4
                  className={`font-medium text-sm ${
                    isDark ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  {user.name}
                </h4>
                <p
                  className={`text-xs truncate ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {user.lastMessage}
                </p>
              </div>
              <span
                className={`text-xs whitespace-nowrap ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {user.time}
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
          <img
            src={chatUsers.find((u) => u.id === selectedChat)?.avatar}
            alt="Chat"
            className="w-10 h-10 rounded-full"
          />
          <h4
            className={`text-base font-semibold ${
              isDark ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {chatUsers.find((u) => u.id === selectedChat)?.name}
          </h4>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {currentConversation.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[40%] break-words p-3 rounded-lg text-sm shadow-md ${
                msg.sender === "You"
                  ? "bg-[#288683] text-white ml-auto"
                  : `${
                      isDark
                        ? "bg-[#2a2a2a] text-gray-100"
                        : "bg-gray-100 text-gray-800"
                    }`
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newMessage.trim()) return;
            dummyConversation[selectedChat].push({
              sender: "You",
              text: newMessage,
            });
            setNewMessage("");
          }}
          className={`flex items-center gap-3 p-4 border-t transition-colors ${
            isDark ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className={`flex-1 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#288683]
              ${
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
