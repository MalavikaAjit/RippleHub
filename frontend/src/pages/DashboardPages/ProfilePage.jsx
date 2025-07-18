import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaCog, FaEdit, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import usePostStore from "../../store/postStore";
import { Navigate, useNavigate } from "react-router-dom";
// Ensure baseUrl has no trailing slash
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:2057";

const ImageWithErrorBoundary = ({ src, alt, postId, index, handleImageError, ...props }) => {
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
        src={error ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='3' y1='9' x2='21' y2='9'%3E%3C/line%3E%3Cline x1='9' y1='21' x2='9' y2='9'%3E%3C/line%3E%3C/svg%3E" : src}
        alt={alt}
        onError={() => {
          setError(true);
          setLoading(false);
          handleImageError(postId, index, src); // Pass src to error handler
        }}
        onLoad={() => {
          setLoading(false);
        }}
        className={`w-full h-48 object-cover ${loading && !error ? "opacity-0" : "opacity-100"}`}
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

  // Fetch posts once on mount
  useEffect(() => {
    fetchPost().catch((err) => console.error("Failed to fetch posts:", err));
  }, [fetchPost]);

  // Log the posts to verify structure
  useEffect(() => {
    if (posts && posts.length > 0) {
      console.log("Posts in component:", posts);
      console.log("First post images:", posts[0].post_image);
    }
  }, [posts]);

  // Initialize slides only if not already initialized
  useEffect(() => {
    if (Object.keys(currentSlide).length === 0 && posts.length > 0) {
      const slidesInit = {};
      posts.forEach((post) => {
        if (post._id) slidesInit[post._id] = 0;
      });
      setCurrentSlide(slidesInit);
    }
  }, [posts, currentSlide]);

  // Corrected image URL function
  const imageUrl = (imgPath) => {
    if (!imgPath || typeof imgPath !== "string" || imgPath.trim() === "") {
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='3' y1='9' x2='21' y2='9'%3E%3C/line%3E%3Cline x1='9' y1='21' x2='9' y2='9'%3E%3C/line%3E%3C/svg%3E";
    }
    
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
      return imgPath;
    }
    
    // Use the correct endpoint that matches your server route
    return `${baseUrl}/uploads/${imgPath}`;
  };

  // Fixed error handler - now receives src directly
  const handleImageError = (postId, index, src) => {
    console.error(`Image failed to load for post ${postId}, index ${index}`);
    console.error("Attempted URL:", src);
    setImageError((prev) => ({ ...prev, [`${postId}-${index}`]: true }));
  };

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
 const navigate = useNavigate();

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
                {user?.isVerified && <FaCheckCircle className="text-[#288683]" />}
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Experienced coder specializing in Python and JavaScript, focused on scalable web apps.
              </p>
              <div className="flex gap-4 mt-2 text-sm font-medium">
                <p className={isDark ? "text-white" : "text-gray-700"}>
                  Posts: <span className="font-bold">{posts.length}</span>
                </p>
                <p className={isDark ? "text-white" : "text-gray-700"}>
                  Friends: <span className="font-bold">136</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-3 py-2 bg-[#288683] text-white text-sm rounded-md hover:bg-[#1c5e5a] flex items-center gap-1" onClick={() => navigate("/edit")}>
              <FaEdit /> Edit
            </button>
            <button className="px-3 py-2 bg-gray-300 text-gray-800 text-sm rounded-md hover:bg-gray-400 flex items-center gap-1" onClick= {() => navigate("/profilesetting")}>
              <FaCog /> Settings
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <hr className="flex-grow border-t border-gray-400 dark:border-gray-600" />
          <span className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            Ripple Store
          </span>
          <hr className="flex-grow border-t border-gray-400 dark:border-gray-600" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {error && <p className="text-red-500">{error}</p>}
          {isLoading && <p className={isDark ? "text-white" : "text-gray-700"}>Loading posts...</p>}
          {!isLoading && posts.length === 0 && (
            <p className={isDark ? "text-white" : "text-gray-700"}>No posts available for this user.</p>
          )}

          {posts.map((post) => {
            if (!post?._id) return null;

            // Extract images safely
            let images = [];
            if (Array.isArray(post.post_image)) {
              images = post.post_image.filter(img => 
                typeof img === "string" && img.trim() !== ""
              );
            }

            if (images.length === 0) {
              images = ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='3' y1='9' x2='21' y2='9'%3E%3C/line%3E%3Cline x1='9' y1='21' x2='9' y2='9'%3E%3C/line%3E%3C/svg%3E"];
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
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;