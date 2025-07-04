import React, { useEffect, useState } from "react";
import { FaSearch, FaCircle } from "react-icons/fa";
import axios from "axios";
import { useThemeStore } from "../../store/themeStore";
import { useFriendRequestStore } from "../../store/friendRequestStore";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FindPage = () => {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const {
    sendRequest,
    requests,
    fetchRequests,
    respondToRequest,
    cancelRequest,
  } = useFriendRequestStore();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:2057/api/user/all", {
          withCredentials: true,
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };

    fetchUsers();
    fetchRequests();
  }, [fetchRequests]);

  const handleSend = async (receiverId) => {
    try {
      await sendRequest(receiverId);
      toast.success("Friend request sent");
    } catch {
      toast.error("Failed to send or already sent");
    }
  };

  const handleRespond = async (requestId, action) => {
    try {
      await respondToRequest(requestId, action);
      toast.success(`Request ${action}ed`);
    } catch {
      toast.error("Failed to respond");
    }
  };

  const handleCancel = async (requestId) => {
    try {
      await cancelRequest(requestId);
      toast.success("Request cancelled");
    } catch {
      toast.error("Failed to cancel request");
    }
  };

  const getRequestInfo = (targetId) => {
    const req = requests.find(
      (r) =>
        (r.sender._id === user._id && r.receiver._id === targetId) ||
        (r.receiver._id === user._id && r.sender._id === targetId)
    );
    if (!req) return null;

    const isSender = req.sender._id === user._id;
    return {
      status: req.status,
      direction: isSender ? "sent" : "received",
      requestId: req._id,
    };
  };

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen px-4 py-6 sm:px-6 md:px-8 transition duration-300 ${
        isDark ? "bg-[#111111]" : "bg-[#f3f6fa]"
      }`}
    >
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <FaSearch className="text-[#288683] text-xl sm:text-2xl" />
          <h2
            className={`text-xl sm:text-2xl font-extrabold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Find Them
          </h2>
        </div>

        {/* Search Input */}
        <div className="flex justify-center w-full mb-6">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search Ripples..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#27b1ab] text-sm
              ${
                isDark
                  ? "bg-[#2a2a2a] border-gray-600 text-gray-200"
                  : "bg-white border-gray-200 text-gray-800"
              }`}
            />
          </div>
        </div>

        {/* User List */}
        <div className="space-y-3">
          {filteredUsers.length === 0 ? (
            <p
              className={`text-center ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No users found
            </p>
          ) : (
            filteredUsers.map((u) => {
              const reqInfo = getRequestInfo(u._id);
              return (
                <div
                  key={u._id}
                  className={`flex items-center justify-between gap-4 px-4 py-4 rounded-md transition-colors ${
                    isDark
                      ? "bg-[#1f1f1f] text-white"
                      : "bg-white text-gray-800 shadow"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://i.pravatar.cc/150?u=${u._id}`}
                      alt={u.firstName}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-base flex items-center gap-2">
                        {u.firstName} {u.lastName}
                        {u.isOnline && (
                          <FaCircle className="text-green-500 text-[10px]" />
                        )}
                      </h4>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap justify-end">
                    {reqInfo ? (
                      reqInfo.status === "pending" &&
                      reqInfo.direction === "received" ? (
                        <>
                          <button
                            onClick={() =>
                              handleRespond(reqInfo.requestId, "accept")
                            }
                            className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleRespond(reqInfo.requestId, "decline")
                            }
                            className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Decline
                          </button>
                        </>
                      ) : reqInfo.status === "pending" &&
                        reqInfo.direction === "sent" ? (
                        <button
                          onClick={() => handleCancel(reqInfo.requestId)}
                          className="px-4 py-1.5 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span
                          className={`text-sm px-4 py-1.5 rounded-full font-medium ${
                            reqInfo.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {reqInfo.status === "accepted"
                            ? "Friends"
                            : "Declined"}
                        </span>
                      )
                    ) : (
                      <button
                        onClick={() => handleSend(u._id)}
                        className="px-4 py-1.5 text-sm bg-[#288683] text-white rounded-lg hover:bg-opacity-90 transition"
                      >
                        Add Friend
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FindPage;
