import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaCog, FaEdit, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import usePostStore from "../../store/postStore";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:2057/";

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
        src={error ? "https://via.placeholder.com/150?text=Image+Error" : src}
        alt={alt}
        onError={() => {
          setError(true);
          setLoading(false);
          handleImageError(postId, index);
        }}
        onLoad={() => {
          setLoading(false);
          console.log("Image loaded successfully:", src);
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

  useEffect(() => {
    if (posts.length === 0 && !isLoading) {
      console.log("Auth state:", { user });
      console.log("Post state before fetch:", { isLoading, error, posts });
      console.log("Fetching posts...");
      fetchPost().catch((err) => console.error("Failed to fetch posts:", err));
    }
  }, [posts, fetchPost, user, isLoading]);

  const userPosts = Array.isArray(posts) ? posts : [];

  useEffect(() => {
    console.log(
      "User posts:",
      userPosts.map((post) => ({ _id: post._id, post_image: post.post_image, userId: post.userId, caption: post.caption }))
    );
    console.log("Current slide state:", currentSlide);
    console.log("Image error state:", imageError);
    if (userPosts.length > 0) {
      const slidesInit = {};
      userPosts.forEach((post) => {
        if (post._id) slidesInit[post._id] = 0;
      });
      setCurrentSlide(slidesInit);
    }
  }, [userPosts]);

  const getFileNameFromPath = (path) => {
    if (!path || typeof path !== "string" || path.trim() === "") {
      console.warn("Invalid image path:", path);
      return "";
    }
    return path.replace(/\\/g, "/").replace(/^uploads\//, "").split("/").pop();
  };

  const imageUrl = (imgPath) => {
    if (!imgPath || typeof imgPath !== "string" || imgPath.trim() === "") {
      console.warn("Invalid image path:", imgPath);
      return "https://via.placeholder.com/150?text=No+Image";
    }
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
      console.log("Using full URL:", imgPath);
      return imgPath;
    }
    const fileName = getFileNameFromPath(imgPath);
    const url = fileName ? `${baseUrl}uploads/${fileName}` : "https://via.placeholder.com/150?text=No+Image";
    console.log("Generated image URL:", url);
    return url;
  };

  const handleImageError = (postId, index) => {
    console.error(`Image failed to load for post ${postId}, index ${index}`);
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
                  Posts: <span className="font-bold">{userPosts.length}</span>
                </p>
                <p className={isDark ? "text-white" : "text-gray-700"}>
                  Friends: <span className="font-bold">136</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-3 py-2 bg-[#288683] text-white text-sm rounded-md hover:bg-[#1c5e5a] flex items-center gap-1">
              <FaEdit /> Edit
            </button>
            <button className="px-3 py-2 bg-gray-300 text-gray-800 text-sm rounded-md hover:bg-gray-400 flex items-center gap-1">
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
          {!isLoading && userPosts.length === 0 && (
            <p className={isDark ? "text-white" : "text-gray-700"}>No posts available for this user.</p>
          )}

          {userPosts.map((post) => {
            if (!post?._id) {
              console.warn("Post missing _id:", post);
              return null;
            }

            const images = Array.isArray(post.post_image) && post.post_image.length > 0
              ? post.post_image.filter((img) => typeof img === "string" && img.trim() !== "")
              : ["https://via.placeholder.com/150?text=No+Image"];

            console.log(`Images for post ${post._id}, post.userId: ${post.userId}, user._id: ${user?._id}, caption: ${post.caption}`, images);

            if (images.length === 0) {
              console.warn(`No valid images for post ${post._id}, post_image:`, post.post_image);
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
                <p
                  className={`text-sm p-2 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  } truncate`}
                >
                  {post.caption || "No caption"}
                </p>
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