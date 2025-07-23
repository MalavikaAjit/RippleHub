import React, { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { usePostInteractionStore } from "../store/postInteractionStore";
import { useProfileStore } from "../store/profileStore";

import axios from "axios";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { isDark } = useThemeStore();
  const { isCollapsed } = useOutletContext();
  const navigate = useNavigate();
  const postMenuRefs = useRef({});
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [activePostMenuId, setActivePostMenuId] = useState(null);

  const fetchInteractions = usePostInteractionStore(
    (state) => state.fetchInteractions
  );
  const toggleLike = usePostInteractionStore((state) => state.toggleLike);
  const addComment = usePostInteractionStore((state) => state.addComment);
  const interactions = usePostInteractionStore((state) => state.interactions);

  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:2057";

  useEffect(() => {
    if (user?._id) {
      fetchProfile(user._id);
    }
  }, [user?._id]);

  const getProfileImageUrl = () => {
    if (!profile?.profileImage || typeof profile.profileImage !== "string") {
      return "https://dummyimage.com/100x100/cccccc/000000&text=No+Image";
    }
    if (
      profile.profileImage.startsWith("http") ||
      profile.profileImage.startsWith("blob:")
    ) {
      return profile.profileImage;
    }
    return `http://localhost:2057/${profile.profileImage.replace(/^\/?/, "")}`;
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:2057/api/friends-feed", {
        withCredentials: true,
      });
      setPosts(res.data);
      res.data.forEach((post) => fetchInteractions(post._id));
    } catch (err) {
      console.error("Failed to load posts", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const allRefs = Object.values(postMenuRefs.current);
      if (allRefs.every((ref) => !ref?.contains(event.target))) {
        setActivePostMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLike = async (postId) => {
    await toggleLike(postId);
    fetchInteractions(postId); // refresh interaction
  };

  const handleCommentSubmit = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    await addComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    fetchInteractions(postId); // refresh interaction
  };

  return (
    <div
      className={`${
        isDark ? "bg-[#0d0d0d] text-white" : "bg-[#f3f6fa] text-gray-800"
      } min-h-screen transition-all duration-300`}
    >
      <div
        className={`${
          isDark
            ? "bg-[#121212] border-gray-700"
            : "bg-[#f3f6fa] border-gray-200"
        } sticky top-0 z-30 px-6 py-4 flex justify-end border-b`}
      >
        <div className="relative ml-4">
          <div
            onClick={() => navigate("/profile")}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#27b1ab] to-[#1c5e5a] p-[2px] cursor-pointer animate-pulse hover:scale-105 transition"
          >
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-md">
              <img
                src={getProfileImageUrl()}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover border border-[#288683]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center px-4 py-6 gap-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className={`rounded-lg shadow-md overflow-hidden max-w-xl w-full transition-all ${
              isDark ? "bg-[#1e1e1e]" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <img
                  src={
                    post.userId?.profileImage
                      ? post.userId.profileImage.startsWith("http") ||
                        post.userId.profileImage.startsWith("blob:")
                        ? post.userId.profileImage
                        : `http://localhost:2057/${post.userId.profileImage.replace(
                            /^\/?/,
                            ""
                          )}`
                      : "https://dummyimage.com/100x100/cccccc/000000&text=No+Image"
                  }
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border border-[#288683]"
                />

                <div>
                  <h3 className="font-semibold text-base">
                    {post.userId?.firstName}
                  </h3>
                  <span className="text-sm flex items-center text-gray-400">
                    Shared a Ripple • {dayjs(post.createdAt).fromNow()}
                  </span>
                </div>
              </div>

              {/* <div className="relative">
                <button
                  onClick={() =>
                    setActivePostMenuId(
                      activePostMenuId === post._id ? null : post._id
                    )
                  }
                  className={`p-2 rounded-full text-gray-500 cursor-pointer ${
                    isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-100"
                  }`}
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                {activePostMenuId === post._id && (
                  <div
                    ref={(el) => (postMenuRefs.current[post._id] = el)}
                    className={`absolute top-10 right-0 w-48 py-2 z-50 rounded-md text-sm shadow-xl transition-all ${
                      isDark
                        ? "bg-[#1e1e1e] text-gray-200 border border-gray-700"
                        : "bg-white text-gray-700 border border-gray-100"
                    }`}
                  >
                    <button
                      className={`flex items-center w-full px-4 py-2 transition ${
                        isDark ? "hover:bg-[#3a3a3a]" : "hover:bg-gray-100"
                      }`}
                    >
                      <Pencil className="w-4 h-4 mr-2 text-orange-500" /> Edit
                      Post
                    </button>
                    <button
                      className={`flex items-center w-full px-4 py-2 transition ${
                        isDark ? "hover:bg-[#3a3a3a]" : "hover:bg-gray-100"
                      }`}
                    >
                      <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Delete
                      Post
                    </button>
                  </div>
                )}
              </div> */}
            </div>

            <div
              className={`${
                isDark ? "bg-gray-800" : "bg-gray-100"
              } aspect-square`}
            >
              <img
                src={`http://localhost:2057/uploads/${post.post_image[0]}`}
                alt="Ripple"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <div className="flex items-center justify-start mb-3 space-x-2">
                <button
                  onClick={() => handleLike(post._id)}
                  className={`p-2 rounded-full cursor-pointer transition ${
                    isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-100"
                  }`}
                >
                  <Heart
                    className="w-6 h-6"
                    fill={interactions[post._id]?.isLiked ? "#288683" : "none"}
                    color={
                      interactions[post._id]?.isLiked
                        ? "#288683"
                        : isDark
                        ? "#ffffff"
                        : "#000000"
                    }
                  />
                </button>
              </div>

              <p className="text-sm mb-3">
                <span className="font-semibold mr-2">
                  {post.userId?.firstName}
                </span>
                {post.caption}
              </p>

              <div className="space-y-2 mb-3">
                {(interactions[post._id]?.comments || []).map((c, idx) => (
                  <p key={idx} className="text-sm">
                    <span className="font-semibold mr-2">
                      {c.user?.firstName || "User"}:
                    </span>
                    {c.text}
                  </p>
                ))}
              </div>

              <div
                className={`flex items-center space-x-2 pt-3 border-t ${
                  isDark ? "border-gray-700" : "border-gray-100"
                }`}
              >
                <input
                  type="text"
                  placeholder="Add your insight..."
                  value={commentInputs[post._id] || ""}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({
                      ...prev,
                      [post._id]: e.target.value,
                    }))
                  }
                  className={`flex-1 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#288683] text-sm ${
                    isDark
                      ? "bg-[#2a2a2a] border-gray-600 text-gray-200"
                      : "bg-white border-gray-200 text-gray-800"
                  }`}
                />
                <button
                  onClick={() => handleCommentSubmit(post._id)}
                  className="p-2 rounded-full bg-[#288683] hover:bg-opacity-90 text-white cursor-pointer"
                  title="Submit"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
