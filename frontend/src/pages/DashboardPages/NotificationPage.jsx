import React, { useEffect } from "react";
import {
  FaBell,
  FaUserPlus,
  FaCommentDots,
  FaHeart,
  FaCheckCircle,
} from "react-icons/fa";
import { useThemeStore } from "../../store/themeStore";
import { useNotificationStore } from "../../store/notificationStore";
import { useFriendRequestStore } from "../../store/friendRequestStore";

const iconMap = {
  like: <FaHeart className="text-red-500" />,
  comment: <FaCommentDots className="text-green-500" />,
  follow: <FaUserPlus className="text-blue-500" />,
  friend_request: <FaUserPlus className="text-blue-500" />,
  request_accepted: <FaCheckCircle className="text-green-500" />,
  friend_accept: <FaCheckCircle className="text-green-500" />,
};

const typeBadge = {
  like: "Like",
  follow: "New Follower",
  comment: "Comment",
  friend_request: "Friend Request",
  request_accepted: "Accepted",
  friend_accept: "Accepted",
};

const NotificationPage = () => {
  const { isDark } = useThemeStore();
  const {
    notifications,
    fetchNotifications,
    updateNotificationResponse,
    initSocket,
  } = useNotificationStore();
  const { respondToRequest } = useFriendRequestStore();

  useEffect(() => {
    fetchNotifications();
    initSocket(); //  Enable real-time
  }, []);

  const handleAction = async (requestId, action, notificationId) => {
    try {
      const status = await respondToRequest(requestId, action);
      updateNotificationResponse(notificationId, status);
    } catch (err) {
      console.error(`Failed to ${action} request`, err);
    }
  };

  const grouped = notifications.reduce((acc, curr) => {
    const date = new Date(curr.createdAt);
    const group =
      date.toDateString() === new Date().toDateString() ? "Today" : "Earlier";
    acc[group] = acc[group] ? [...acc[group], curr] : [curr];
    return acc;
  }, {});

  const hasNotifications = notifications.length > 0;

  return (
    <div
      className={`p-6 min-h-screen transition duration-300 ${
        isDark ? "bg-[#121212]" : "bg-[#f3f6fa]"
      }`}
    >
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
          {Object.keys(grouped).map((group) => (
            <div key={group}>
              <h3
                className={`text-sm font-semibold mb-3 uppercase tracking-wider ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {group}
              </h3>
              <div className="space-y-3">
                {grouped[group].map((n) => (
                  <div
                    key={n._id}
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
                      {iconMap[n.type] || <FaBell />}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm mb-1 ${
                          isDark ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {n.message}
                      </p>
                      <div className="flex justify-between items-center text-xs">
                        <span
                          className={`${
                            isDark ? "text-gray-400" : "text-gray-400"
                          }`}
                        >
                          {new Date(n.createdAt).toLocaleTimeString()}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-medium
                          ${
                            isDark
                              ? "bg-[#2a2a2a] text-gray-300"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {typeBadge[n.type] || "Notification"}
                        </span>
                      </div>

                      {n.type === "friend_request" &&
                        n.requestId &&
                        n.responded !== "accepted" &&
                        n.responded !== "declined" && (
                          <div className="flex gap-3 mt-2">
                            {n.responded === "accepted" ? (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded font-medium text-sm">
                                Friends
                              </span>
                            ) : n.responded === "declined" ? (
                              <span className="px-3 py-1 bg-red-100 text-red-700 rounded font-medium text-sm">
                                Declined
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    handleAction(n.requestId, "accept", n._id)
                                  }
                                  className="px-3 py-1 text-sm font-medium rounded bg-green-500 text-white hover:bg-green-600"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() =>
                                    handleAction(n.requestId, "decline", n._id)
                                  }
                                  className="px-3 py-1 text-sm font-medium rounded bg-red-500 text-white hover:bg-red-600"
                                >
                                  Decline
                                </button>
                              </>
                            )}
                          </div>
                        )}
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
            No new notifications for now
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
