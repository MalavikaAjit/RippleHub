import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaCog,
  FaEdit,
  FaArrowLeft,
  FaArrowRight,
  FaUserFriends,
} from "react-icons/fa";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import usePostStore from "../../store/postStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:2057";

const ImageWithErrorBoundary = ({
  src,
  alt,
  postId,
  index,
  handleImageError,
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full h-48 relative">
      {loading && !error && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}
      <img
        src={
          error
            ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='3' y1='9' x2='21' y2='9'%3E%3C/line%3E%3Cline x1='9' y1='21' x2='9' y2='9'%3E%3C/line%3E%3C/svg%3E"
            : src
        }
        alt={alt}
        onError={() => {
          setError(true);
          setLoading(false);
          handleImageError(postId, index, src);
        }}
        onLoad={() => setLoading(false)}
        className={`w-full h-48 object-cover ${
          loading && !error ? "opacity-0" : "opacity-100"
        }`}
        {...props}
      />
    </div>
  );
};


const ProfilePage = () => {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();
  const { isLoading, error, posts, fetchPost } = usePostStore();

  const [currentSlide, setCurrentSlide] = useState({});
  const [imageError, setImageError] = useState({});
  const [friends, setFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPost().catch((err) => console.error("Failed to fetch posts:", err));
    fetchFriends();
  }, [fetchPost]);

  const fetchFriends = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/user/friends`, {
        withCredentials: true,
      });
      setFriends(res.data);
    } catch (err) {
      console.error("Failed to load friends:", err);
    }
  };

  const handleUnfriend = async (friendId) => {
    try {
      await axios.post(
        `${baseUrl}/api/friend-request/unfriend`,
        { friendId },
        { withCredentials: true }
      );
      fetchFriends();
    } catch (err) {
      console.error("Failed to unfriend:", err);
    }
  };

  const imageUrl = (imgPath) => {
    if (!imgPath || typeof imgPath !== "string" || imgPath.trim() === "") {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='3' y1='9' x2='21' y2='9'%3E%3C/line%3E%3Cline x1='9' y1='21' x2='9' y2='9'%3E%3C/line%3E%3C/svg%3E";
    }
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
      return imgPath;
    }
    return `${baseUrl}/uploads/${imgPath}`;
  };

  const handleImageError = (postId, index, src) => {
    setImageError((prev) => ({ ...prev, [`${postId}-${index}`]: true }));
  };

  const handlePrevSlide = (postId) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [postId]: prev[postId] > 0 ? prev[postId] - 1 : 0,
    }));
  };


  const [currentSlide, setCurrentSlide] = useState({});
  const [imageError, setImageError] = useState({});

  useEffect(() => {
    // Fetch posts and handle errors
    fetchPost().catch((err) => console.error("Failed to fetch posts:", err));

    // Initialize slide indices only if posts is a valid array
    if (Array.isArray(posts) && posts.length > 0) {
      const initialSlides = posts.reduce((acc, post) => {
        if (post?._id) {
          return { ...acc, [post._id]: 0 };
        }
        return acc;
      }, {});
      setCurrentSlide(initialSlides);
    }
  }, [fetchPost, posts]);

  // Helper: extract filename from full backend file path
  const getFileNameFromPath = (path) => {
    if (!path || typeof path !== "string") return "";
    return path.split(/[/\\]/).pop();
  };

  // Construct image URL
  const imageUrl = (imgPath) => `${baseUrl}uploads/${getFileNameFromPath(imgPath)}`;

  // Handle image loading errors
  const handleImageError = (postId, index) => {
    setImageError((prev) => ({ ...prev, [`${postId}-${index}`]: true }));
  };

  // Slider handlers
  const handlePrevSlide = (postId) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [postId]: prev[postId] > 0 ? prev[postId] - 1 : 0,
    }));
  };


  const handleNextSlide = (postId, count) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [postId]: prev[postId] < count - 1 ? prev[postId] + 1 : count - 1,
    }));
  };

  return (
    <div
      className={`min-h-screen px-4 py-6 sm:px-6 md:px-8 transition duration-300 ${
        isDark ? "bg-[#111111]" : "bg-[#f3f6fa]"
      }`}
    >
      <div className="max-w-5xl mx-auto w-full space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex gap-5 items-center">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-[#288683] shadow-md"
              loading="lazy"
            />
            <div>
              <h3
                className={`text-xl font-bold flex items-center gap-2 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                {user?.firstName || "User"} {user?.lastName || ""}
                {user?.isVerified && (
                  <FaCheckCircle className="text-[#288683]" />
                )}
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Experienced coder specializing in Python and JavaScript, focused
                on scalable web apps.
              </p>
              <div className="flex gap-4 mt-2 text-sm font-medium">
                <p className={isDark ? "text-white" : "text-gray-700"}>
                  Posts: <span className="font-bold">{posts.length}</span>

                {user?.isVerified && <FaCheckCircle className="text-[#288683]" />}
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Experienced coder specializing in Python and JavaScript, with a focus on developing scalable web applications.
                Enjoy the challenge of optimizing code for performance and building user-friendly interfaces.
              </p>
              <div className="flex gap-4 mt-2 text-sm font-medium">
                <p className={isDark ? "text-white" : "text-gray-700"}>
                  Posts: <span className="font-bold">{Array.isArray(posts) ? posts.length : 0}</span>

                </p>
                <p
                  onClick={() => setShowFriends(true)}
                  className={`cursor-pointer flex items-center gap-1 ${
                    isDark ? "text-white" : "text-gray-700"
                  }`}
                >
                  <FaUserFriends /> Friends:{" "}
                  <span className="font-bold">{friends.length}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="px-3 py-2 bg-[#288683] text-white text-sm rounded-md hover:bg-[#1c5e5a] flex items-center gap-1"
              onClick={() => navigate("/edit")}
            >
              <FaEdit /> Edit
            </button>
            <button className="px-3 py-2 bg-gray-300 text-gray-800 text-sm rounded-md hover:bg-gray-400 flex items-center gap-1">
              <FaCog /> Settings
            </button>
          </div>
        </div>

        {/* Friend List Modal */}
        {showFriends && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm px-4 py-6 overflow-auto">
            <div
              className={`w-full max-w-2xl rounded-2xl shadow-xl p-6 relative ${
                isDark ? "bg-[#1f1f1f]" : "bg-white"
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowFriends(false)}
                className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition ${
                  isDark
                    ? "bg-[#333] hover:bg-[#444] text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                <span className="text-xl">×</span>
              </button>

              {/* Title */}
              <h2
                className={`text-2xl font-bold text-center mb-6 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Your Friends
              </h2>

              {/* Friend List */}
              {friends.length === 0 ? (
                <p
                  className={`text-center ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  You don't have any friends yet.
                </p>
              ) : (
                <ul className="space-y-4">
                  {friends.map((friend) => (
                    <li
                      key={friend._id}
                      className={`flex items-center justify-between rounded-xl p-3 transition hover:shadow-md ${
                        isDark ? "bg-[#2a2a2a]" : "bg-gray-100"
                      }`}
                    >
                      {/* Avatar + Name */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-red-500 text-white flex items-center justify-center font-bold shadow-sm">
                          {friend.firstName?.[0]}
                          {friend.lastName?.[0]}
                        </div>
                        <p
                          className={`font-medium ${
                            isDark ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {friend.firstName} {friend.lastName}
                        </p>
                      </div>

                      {/* Unfriend Button */}
                      <button
                        onClick={() => handleUnfriend(friend._id)}
                        className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        Unfriend
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Posts Section */}
        <div className="flex items-center gap-4 mt-10">
          <hr className="flex-grow border-t border-gray-400 dark:border-gray-600" />
          <span
            className={`text-lg font-semibold ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Ripple Store
          </span>
          <hr className="flex-grow border-t border-gray-400 dark:border-gray-600" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {error && <p className="text-red-500">{error}</p>}
          {isLoading && (
            <p className={isDark ? "text-white" : "text-gray-700"}>
              Loading posts...
            </p>
          )}
          {!isLoading && posts.length === 0 && (
            <p className={isDark ? "text-white" : "text-gray-700"}>
              No posts available for this user.
            </p>
          )}

          {posts.map((post) => {
            if (!post?._id) return null;
            let images = Array.isArray(post.post_image)
              ? post.post_image.filter(
                  (img) => typeof img === "string" && img.trim() !== ""
                )
              : [];
            if (images.length === 0) {
              images = [
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='3' y1='9' x2='21' y2='9'%3E%3C/line%3E%3Cline x1='9' y1='21' x2='9' y2='9'%3E%3C/line%3E%3C/svg%3E",
              ];
            }
            const currentIndex = currentSlide[post._id] ?? 0;

            return (
              <div
                key={post._id}
                className={`rounded-lg overflow-hidden shadow-sm relative ${
                  isDark ? "bg-[#1e1e1e]" : "bg-white"
                }`}
              >
                <ImageWithErrorBoundary
                  src={imageUrl(images[currentIndex])}
                  alt={`Post image ${currentIndex + 1}`}
                  postId={post._id}
                  index={currentIndex}
                  handleImageError={handleImageError}
                  loading="lazy"
                />
                {images.length > 1 && (
                  <div className="absolute inset-0 flex justify-between items-center px-4">
                    <button
                      onClick={() => handlePrevSlide(post._id)}
                      disabled={currentIndex === 0}
                      className={`p-3 rounded-full ${
                        currentIndex === 0
                          ? "bg-gray-500/40 cursor-not-allowed"
                          : "bg-[#288683]/80 hover:bg-[#1c5e5a]/90"
                      } text-white shadow-md`}
                    >
                      <FaArrowLeft />
                    </button>
                    <button
                      onClick={() => handleNextSlide(post._id, images.length)}
                      disabled={currentIndex === images.length - 1}
                      className={`p-3 rounded-full ${
                        currentIndex === images.length - 1
                          ? "bg-gray-500/40 cursor-not-allowed"
                          : "bg-[#288683]/80 hover:bg-[#1c5e5a]/90"
                      } text-white shadow-md`}
                    >
                      <FaArrowRight />
                    </button>
                  </div>
                )}
              </div>
            );
        {/* Images fetched from the database */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {error && <p className="text-red-500">{error}</p>}
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => {
              // Validate post and post._id
              if (!post?._id) return null;

              // Normalize post_image into an array of strings
              const images = Array.isArray(post.post_image)
                ? post.post_image.filter((img) => typeof img === "string" && img.trim())
                : post.post_image && typeof post.post_image === "string" && post.post_image.trim()
                ? [post.post_image]
                : [];

              if (images.length === 0) return null;

              const currentIndex = currentSlide[post._id] ?? 0;

              return (
                <div
                  key={post._id}
                  className={`rounded-lg overflow-hidden shadow-sm relative ${
                    isDark ? "bg-[#1e1e1e]" : "bg-white"
                  }`}
                >
                  {/* Visible image */}
                  <img
                    src={imageError[`${post._id}-${currentIndex}`] ? "/fallback-image.jpg" : imageUrl(images[currentIndex])}
                    alt={`Post image ${currentIndex + 1}`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    onError={() => handleImageError(post._id, currentIndex)}
                  />
                  {/* Preload all images for this post */}
                  <div className="hidden">
                    {images.map((img, index) => (
                      <img
                        key={`${post._id}-${index}`}
                        src={imageUrl(img)}
                        alt={`Preload image ${index + 1}`}
                        onError={() => handleImageError(post._id, index)}
                        loading="lazy"
                      />
                    ))}
                  </div>
                  {/* Navigation arrows for multiple images */}
                  {images.length > 1 && (
                    <div className="absolute inset-0 flex justify-between items-center px-4">
                      <button
                        onClick={() => handlePrevSlide(post._id)}
                        disabled={currentIndex === 0}
                        className={`p-3 rounded-full transition-all duration-200 ${
                          isDark
                            ? currentIndex === 0
                              ? "bg-gray-600/50 cursor-not-allowed"
                              : "bg-[#288683]/80 hover:bg-[#1c5e5a]/90"
                            : currentIndex === 0
                            ? "bg-gray-300/50 cursor-not-allowed"
                            : "bg-[#288683]/80 hover:bg-[#1c5e5a]/90"
                        } text-white shadow-md hover:shadow-lg`}
                        aria-label="Previous image"
                      >
                        <FaArrowLeft className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleNextSlide(post._id, images.length)}
                        disabled={currentIndex === images.length - 1}
                        className={`p-3 rounded-full transition-all duration-200 ${
                          isDark
                            ? currentIndex === images.length - 1
                              ? "bg-gray-600/50 cursor-not-allowed"
                              : "bg-[#288683]/80 hover:bg-[#1c5e5a]/90"
                            : currentIndex === images.length - 1
                            ? "bg-gray-300/50 cursor-not-allowed"
                            : "bg-[#288683]/80 hover:bg-[#1c5e5a]/90"
                        } text-white shadow-md hover:shadow-lg`}
                        aria-label="Next image"
                      >
                        <FaArrowRight className="text-lg" />
                      </button>
                    </div>
                  )}
                  {/* Pagination dots for multiple images */}
                  {images.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                      <div className="flex gap-1.5">
                        {images.map((_, index) => (
                          <span
                            key={index}
                            className={`h-2 w-2 rounded-full transition-all duration-200 ${
                              index === currentIndex
                                ? isDark
                                  ? "bg-white"
                                  : "bg-[#288683]"
                                : isDark
                                ? "bg-gray-500/50"
                                : "bg-gray-300/50"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            !isLoading && <p className={isDark ? "text-white" : "text-gray-700"}>No posts available.</p>
          )}

        </div>
      </div>
    </div>
  );
};
export default ProfilePage;


