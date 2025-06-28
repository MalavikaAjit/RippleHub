import React from "react";
import {
  FaBell,
  FaUserPlus,
  FaCommentDots,
  FaHeart,
  FaCheckCircle,
} from "react-icons/fa";
import { useThemeStore } from "../../store/themeStore"; // Adjust path if needed

const notifications = [
  {
    id: 1,
    type: "like",
    icon: <FaHeart className="text-red-500" />,
    message: "Alex liked your Ripple post.",
    time: "5 mins ago",
    group: "Today",
  },
  {
    id: 2,
    type: "follow",
    icon: <FaUserPlus className="text-blue-500" />,
    message: "Sophie started following you.",
    time: "20 mins ago",
    group: "Today",
  },
  {
    id: 3,
    type: "comment",
    icon: <FaCommentDots className="text-green-500" />,
    message: "Mike commented on your Ripple.",
    time: "2 hours ago",
    group: "Today",
  },
  {
    id: 4,
    type: "like",
    icon: <FaHeart className="text-red-500" />,
    message: "Emma liked your insight.",
    time: "Yesterday",
    group: "Earlier",
  },
  {
    id: 5,
    type: "follow",
    icon: <FaUserPlus className="text-blue-500" />,
    message: "David started following you.",
    time: "2 days ago",
    group: "Earlier",
  },
];

const groupedNotifications = notifications.reduce((acc, curr) => {
  acc[curr.group] = acc[curr.group] ? [...acc[curr.group], curr] : [curr];
  return acc;
}, {});

const typeBadge = {
  like: "Like",
  follow: "New Follower",
  comment: "Comment",
};

const NotificationPage = () => {
  const { isDark } = useThemeStore();
  const hasNotifications = notifications.length > 0;

  return (
    <div
      className={`p-6 min-h-screen transition duration-300 ${
        isDark ? "bg-[#121212]" : "bg-[#f3f6fa]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <FaBell className="text-[#288683] text-xl" />
        <h2
          className={`text-xl font-semibold ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Notifications
        </h2>
      </div>

      {hasNotifications ? (
        <div className="space-y-8">
          {Object.keys(groupedNotifications).map((group) => (
            <div key={group}>
              <h3
                className={`text-sm font-semibold mb-3 uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {group}
              </h3>
              <div className="space-y-3">
                {groupedNotifications[group].map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 p-4 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 
                    ${
                      isDark
                        ? "bg-[#1e1e1e] border-gray-700"
                        : "bg-white border-gray-100"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        isDark ? "bg-[#2a2a2a]" : "bg-gray-100"
                      }`}
                    >
                      {n.icon}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm mb-1 ${
                          isDark ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {n.message}
                      </p>
                      <div className="flex justify-between text-xs">
                        <span
                          className={`${
                            isDark ? "text-gray-400" : "text-gray-400"
                          }`}
                        >
                          {n.time}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-medium
                          ${
                            isDark
                              ? "bg-[#2a2a2a] text-gray-300"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {typeBadge[n.type]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <FaCheckCircle className="text-4xl text-[#288683] mb-4" />
          <h4
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            You're all caught up!
          </h4>
          <p
            className={`${isDark ? "text-gray-400" : "text-gray-500"} text-sm`}
          >
            No new notifications for now 🎉
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
