import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLogout = async () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`${
        isDark ? "bg-[#0d0d0d] text-white" : "bg-[#f3f6fa] text-gray-800"
      } min-h-screen transition-all duration-300`}
    >
      {/* Top Bar */}
      <div
        className={`${
          isDark
            ? "bg-[#121212] border-gray-700"
            : "bg-[#f3f6fa] border-gray-200"
        } sticky top-0 z-30 px-6 py-4 flex justify-between items-center border-b`}
      >
        <div className="flex justify-end w-full">
        {/* Profile Avatar */}
            <div className="relative ml-4">
              <div
                onClick={() => navigate("/profile")}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-[#27b1ab] to-[#1c5e5a] p-[2px] cursor-pointer animate-pulse hover:scale-105 transition"
              >
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex items-center justify-center px-4 py-6">
        <div
          className={`rounded-lg shadow-md overflow-hidden max-w-xl w-full transition-all ${
            isDark ? "bg-[#1e1e1e]" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border border-[#288683]"
              />
              <div>
                <h3 className="font-semibold text-base">{user?.firstName}</h3>
                <span className="text-sm flex items-center space-x-1 text-gray-400">
                  <span>
                    Shared a Ripple • {new Date().toLocaleTimeString()}
                  </span>
                  {privacy === "public" && (
                    <FaGlobeAmericas className="ml-2" title="Public" />
                  )}
                </span>
              </div>
            </div>

            {/* Post Menu */}
            <div className="relative">
              <button
                onClick={() => setShowPostMenu(!showPostMenu)}
                className={`p-2 rounded-full text-gray-500 ${
                  isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-100"
                }`}
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {showPostMenu && (
                <div
                  ref={postMenuRef}
                  className={`fixed top-[104px] w-48 py-2 z-50 rounded-md text-sm shadow-xl transition-all
                  ${isCollapsed ? "right-[440px]" : "right-[360px]"} 
                  ${
                    isDark
                      ? "bg-[#1e1e1e] text-gray-200 border border-gray-700"
                      : "bg-white text-gray-700 border border-gray-100"
                  }`}
                >
                  <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#3a3a3a]">
                    <Pencil className="w-4 h-4 mr-2 text-orange-500" /> Edit
                    Post
                  </button>
                  <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#3a3a3a]">
                    <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Delete Post
                  </button>
                  <div className="border-t my-2 border-gray-200 dark:border-gray-700"></div>
                  <div className="px-4 py-1 text-xs text-gray-500 font-semibold">
                    Privacy
                  </div>
                  <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#3a3a3a]">
                    <FaLock className="w-3 h-3 mr-2 text-gray-500" /> Only Me
                  </button>
                  <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#3a3a3a]">
                    <FaUserFriends className="w-3 h-3 mr-2 text-gray-500" />{" "}
                    Friends
                  </button>
                  <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#3a3a3a]">
                    <FaGlobeAmericas className="w-3 h-3 mr-2 text-gray-500" />{" "}
                    Public
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Ripple Image */}
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-gray-100"
            } aspect-square`}
          >
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
              alt="Ripple"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Actions */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a]">
                  <Heart className="w-6 h-6 text-[#288683]" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a2a]">
                  <MessageCircle className="w-6 h-6 text-[#288683]" />
                </button>
              </div>
            </div>

            <p className="text-sm mb-3">
              <span className="font-semibold mr-2">{user?.firstName}</span>
              What if coding was taught with comic-style storytelling to spark
              logic in kids?
            </p>

            <div className="space-y-2 mb-3">
              <p className="text-sm">
                <span className="font-semibold mr-2">Alex:</span> Brilliant! I’d
                read that in school for sure.
              </p>
            </div>

            <div
              className={`flex items-center space-x-2 pt-3 border-t ${
                isDark ? "border-gray-700" : "border-gray-100"
              }`}
            >
              <input
                type="text"
                placeholder="Add your insight..."
                className={`flex-1 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#288683] text-sm
                ${
                  isDark
                    ? "bg-[#2a2a2a] border-gray-600 text-gray-200"
                    : "bg-white border-gray-200 text-gray-800"
                }`}
              />
              <button className="px-4 py-2 bg-[#288683] text-white rounded-md hover:bg-opacity-90 text-sm font-medium">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
