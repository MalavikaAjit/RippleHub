import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaCog,
  FaEdit,
  FaArrowLeft,
  FaArrowRight,
  FaUserFriends,
  FaTimes,
  FaTrash,
  FaImages,
  FaHeart,
  FaComment,
} from "react-icons/fa";
import axios from "axios"; // Added axios import
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import usePostStore from "../../store/postStore";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "../../store/profileStore";
import { useLocation } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { usePostInteractionStore } from "../../store/postInteractionStore";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:2057";
const fallbackImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='3' y1='9' x2='21' y2='9'%3E%3C/line%3E%3Cline x1='9' y1='21' x2='9' y2='9'%3E%3C/line%3E%3C/svg%3E";

const ImageWithErrorBoundary = ({
  src,
  alt,
  postId,
  index,
  handleImageError,
  onClick,
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div
      className="w-full h-48 relative cursor-pointer"
      onClick={(e) => {
        console.log(
          `Image clicked for post ${postId}, index ${index}, src: ${src}`
        );
        onClick(e);
      }}
      style={{ zIndex: 1 }}
    >
      {loading && !error && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}
      <img
        src={error ? fallbackImage : src}
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
  const {
    isLoading,
    error,
    posts,
    fetchPost,
    success,
    deletePost,
    clearMessages,
  } = usePostStore();
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const [currentSlide, setCurrentSlide] = useState({});
  const [imageError, setImageError] = useState({});
  const [friends, setFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalSlideIndex, setModalSlideIndex] = useState(0);
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
    fetchFriends();
  }, [fetchPost]); // Added dependency

  useEffect(() => {
    if (user?._id) {
      fetchProfile(user._id);
    }
  }, [user?._id, location?.state?.forceRefresh, fetchProfile]);

  useEffect(() => {
    console.log("Profile data:", profile);
  }, [profile]);

  useEffect(() => {
    if (location?.state?.forceRefresh) {
      window.history.replaceState({}, document.title);
    }
  }, [location?.state?.forceRefresh]);

  useEffect(() => {
    if (posts && posts.length > 0) {
      const slidesInit = {};
      posts.forEach((post) => {
        if (post?._id) slidesInit[post._id] = 0;
      });
      setCurrentSlide(slidesInit);
    }
  }, [posts]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, clearMessages]);

  const fetchFriends = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/user/friends`, {
        withCredentials: true,
      });
      setFriends(res.data); // Assuming response contains friends data
    } catch (err) {
      console.error("Failed to fetch friends:", err);
    }
  };

  const imageUrl = (imgPath) => {
    if (!imgPath || typeof imgPath !== "string" || imgPath.trim() === "") {
      return fallbackImage;
    }
    return imgPath.startsWith("http")
      ? imgPath
      : `${baseUrl}/Uploads/${imgPath}`;
  };

  const handleImageError = (postId, index, src) => {
    console.error(
      `Image failed to load for post ${postId}, index ${index}, URL: ${src}`
    );
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
  const { fetchInteractions } = usePostInteractionStore();

  const openPostModal = (post) => {
    const index = posts.findIndex((p) => p._id === post._id);
    if (index !== -1) {
      setSelectedPost(post);
      setSelectedPostIndex(index);
      setModalSlideIndex(0);
      fetchInteractions(post._id); // 👈 fetch likes/comments
    }
  };

  const goToNextPost = () => {
    if (selectedPostIndex < posts.length - 1) {
      const nextPost = posts[selectedPostIndex + 1];
      openPostModal(nextPost);
    }
  };

  const goToPreviousPost = () => {
    if (selectedPostIndex > 0) {
      const prevPost = posts[selectedPostIndex - 1];
      openPostModal(prevPost);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setSelectedPost(null);
      fetchPost();
    } catch (err) {
      console.error(`Failed to delete post ${postId}:`, err);
    }
  };

  const handleEditPost = (postId) => {
    navigate(`/edit/${postId}`);
    setSelectedPost(null);
  };

  const handleLikePost = (postId) => {
    console.log(`Like post ${postId}`);
  };

  const handleCommentPost = (postId) => {
    console.log(`Comment post ${postId}`);
  };
  const { interactions, toggleLike, addComment } = usePostInteractionStore();
  const [newComment, setNewComment] = useState("");
  const [fullCommentsVisible, setFullCommentsVisible] = useState(false);

  return (
    <div
      className={`min-h-screen px-4 py-6 sm:px-6 md:px-8 ${
        isDark ? "bg-[#111111]" : "bg-[#f3f6fa]"
      }`}
    >
      <div className="max-w-5xl mx-auto w-full space-y-10">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex gap-5 items-center">
            <div className="cursor-pointer" onClick={() => navigate("/edit")}>
              <img
                src={
                  profile?.profileImage
                    ? profile.profileImage.startsWith("http") ||
                      profile.profileImage.startsWith("blob:")
                      ? profile.profileImage
                      : `${baseUrl}/${profile.profileImage.replace(/^\/?/, "")}`
                    : fallbackImage
                }
                alt="Profile"
                className="h-24 w-24 object-cover rounded-full border"
              />
            </div>
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
                {profile?.bio || "No bio added yet."}
              </p>
              <div className="flex gap-4 mt-2 text-sm font-medium">
                <p className={isDark ? "text-white" : "text-gray-700"}>
                  Posts: <span className="font-bold">{posts.length}</span>
                </p>
                <p
                  onClick={() => setShowFriends(true)}
                  className={isDark ? "text-white" : "text-gray-700"}
                >
                  Friends: <span className="font-bold">{friends.length}</span>
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
            <button
              className="px-3 py-2 bg-gray-300 text-gray-800 text-sm rounded-md hover:bg-gray-400 flex items-center gap-1"
              onClick={() => navigate("/profile-setting")} // Fixed potential typo
            >
              <FaCog /> Settings
            </button>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center gap-4">
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

        {/* Success/Error Messages and Friends Modal */}
        {showFriends && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
              className={`relative w-full max-w-md mx-auto rounded-xl shadow-lg p-6 transition-all duration-300 ${
                isDark ? "bg-[#1e1e1e] text-white" : "bg-white text-gray-900"
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowFriends(false);
                  clearMessages();
                }}
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
              >
                <FaTimes className="text-lg" />
              </button>

              {/* Modal Header */}
              <h2 className="text-xl font-bold text-center mb-4">
                Your Friends
              </h2>

              {/* Friend List */}
              {friends.length === 0 ? (
                <p
                  className={`text-center text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  You don't have any friends yet.
                </p>
              ) : (
                <ul className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
                  {friends.map((friend) => (
                    <li
                      key={friend._id}
                      className={`flex items-center gap-4 p-3 rounded-lg shadow-sm ${
                        isDark ? "bg-[#2a2a2a]" : "bg-gray-100"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-red-500 text-white flex items-center justify-center font-semibold text-lg">
                        {friend.firstName?.[0] || ""}
                        {friend.lastName?.[0] || ""}
                      </div>
                      <p className="text-sm font-medium">
                        {friend.firstName} {friend.lastName}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
            if (!post?._id) {
              console.warn("Skipping post with missing _id:", post);
              return null;
            }
            const images = Array.isArray(post.post_image)
              ? post.post_image.filter(
                  (img) => typeof img === "string" && img.trim() !== ""
                )
              : [];
            if (images.length === 0) {
              console.warn(
                `No valid images for post ${post._id}, using placeholder`
              );
              images.push("");
            }
            const currentIndex = currentSlide[post._id] ?? 0;

            return (
              <div
                key={post._id}
                onClick={() => openPostModal(post)}
                className={`rounded-lg overflow-hidden shadow-sm relative cursor-pointer transition duration-200 hover:scale-[1.01] ${
                  isDark ? "bg-[#1e1e1e]" : "bg-white"
                }`}
              >
                <ImageWithErrorBoundary
                  src={imageUrl(images[currentIndex])}
                  alt={`Post image ${currentIndex + 1}`}
                  postId={post._id}
                  index={currentIndex}
                  handleImageError={handleImageError}
                  onClick={() => openPostModal(post)}
                />
                {images.length > 1 && (
                  <>
                    <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevSlide(post._id);
                        }}
                        disabled={currentIndex === 0}
                        className={`p-3 rounded-full pointer-events-auto ${
                          currentIndex === 0
                            ? "bg-gray-500/40 cursor-not-allowed"
                            : "bg-[#288683]/80 hover:bg-[#1c5e5a]/90"
                        } text-white shadow-md`}
                        aria-label="Previous slide"
                      >
                        <FaArrowLeft />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextSlide(post._id, images.length);
                        }}
                        disabled={currentIndex === images.length - 1}
                        className={`p-3 rounded-full pointer-events-auto ${
                          currentIndex === images.length - 1
                            ? "bg-gray-500/40 cursor-not-allowed"
                            : "bg-[#288683]/80 hover:bg-[#1c5e5a]/90"
                        } text-white shadow-md`}
                        aria-label="Next slide"
                      >
                        <FaArrowRight />
                      </button>
                    </div>
                    <div className="absolute top-2 right-2 z-10">
                      <FaImages
                        className={`text-lg ${
                          isDark ? "text-gray-200" : "text-gray-600"
                        }`}
                        title="Multiple images"
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          {selectedPostIndex > 0 && (
            <button
              onClick={goToPreviousPost}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-[60] bg-white/90 hover:bg-white dark:bg-[#1e1e1e]/90 dark:hover:bg-[#1e1e1e] text-black dark:text-white rounded-full p-3 shadow-lg"
            >
              <FaArrowLeft />
            </button>
          )}
          {selectedPostIndex < posts.length - 1 && (
            <button
              onClick={goToNextPost}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-[60] bg-white/90 hover:bg-white dark:bg-[#1e1e1e]/90 dark:hover:bg-[#1e1e1e] text-black dark:text-white rounded-full p-3 shadow-lg"
            >
              <FaArrowRight />
            </button>
          )}
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl animate-fadeIn scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-4 z-10 text-2xl text-red-600 dark:text-red-300 hover:text-black dark:hover:text-white focus:outline-none"
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <div className="relative">
              {Array.isArray(selectedPost.post_image) &&
              selectedPost.post_image.length > 0 ? (
                <>
                  {selectedPost.post_image.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setModalSlideIndex((prev) => Math.max(prev - 1, 0))
                        }
                        disabled={modalSlideIndex === 0}
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 z-10 p-2 md:p-3 bg-black/50 text-white rounded-full hover:bg-black ${
                          modalSlideIndex === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <FaArrowLeft />
                      </button>
                      <button
                        onClick={() =>
                          setModalSlideIndex((prev) =>
                            Math.min(
                              prev + 1,
                              selectedPost.post_image.length - 1
                            )
                          )
                        }
                        disabled={
                          modalSlideIndex === selectedPost.post_image.length - 1
                        }
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 z-10 p-2 md:p-3 bg-black/50 text-white rounded-full hover:bg-black ${
                          modalSlideIndex === selectedPost.post_image.length - 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <FaArrowRight />
                      </button>
                    </>
                  )}
                  <img
                    src={imageUrl(
                      selectedPost.post_image[modalSlideIndex] || ""
                    )}
                    alt={`Post Image ${modalSlideIndex + 1}`}
                    className="w-full max-h-[500px] object-contain md:object-cover"
                  />
                  {selectedPost.post_image.length > 1 && (
                    <div className="flex justify-center space-x-2 py-2 bg-white dark:bg-[#1e1e1e]">
                      {selectedPost.post_image.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setModalSlideIndex(idx)}
                          className={`w-3 h-3 rounded-full transition ${
                            idx === modalSlideIndex
                              ? "bg-[#288683]"
                              : "bg-gray-400"
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-300">
                    No image available
                  </p>
                </div>
              )}
            </div>

            {/* ✅ Theme fix applied here */}
            <div
              className={`p-4 rounded-b-xl ${
                isDark ? "bg-[#1e1e1e]" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => handleLikePost(selectedPost._id)}
                  className={`flex items-center gap-2 ${
                    interactions[selectedPost._id]?.isLiked
                      ? "text-red-500"
                      : "text-gray-500"
                  } hover:text-red-600`}
                >
                  <FaHeart />
                  <span>{interactions[selectedPost._id]?.likesCount ?? 0}</span>
                </button>

                <div className="text-gray-600 dark:text-gray-500 flex items-center gap-2">
                  <FaComment />
                  <span>
                    {interactions[selectedPost._id]?.comments?.length ?? 0}
                  </span>
                </div>
              </div>

              <p
                className={`text-base mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {selectedPost.caption || "No caption available"}
              </p>

              {/* Comments */}
              {selectedPost?._id &&
                interactions[selectedPost._id]?.comments?.length > 0 && (
                  <div className="mt-4">
                    <div className="max-h-64 overflow-y-auto space-y-3 text-sm pr-2 scrollbar-thin scrollbar-thumb-gray-400">
                      {(fullCommentsVisible
                        ? interactions[selectedPost._id].comments
                        : interactions[selectedPost._id].comments.slice(0, 3)
                      ).map((comment, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 p-3 rounded-lg border hover:shadow-sm transition ${
                            isDark
                              ? "bg-[#1e1e1e] border-[#333]"
                              : "bg-[#f3f6fa] border-[#ddd]"
                          }`}
                        >
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#288683] to-[#1c5e5a] text-white flex items-center justify-center font-bold">
                            {comment.user?.firstName?.[0] ?? "U"}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-medium mb-1 ${
                                isDark ? "text-white" : "text-[#222]"
                              }`}
                            >
                              <span className="text-[#288683]">
                                {comment.user?.firstName}
                              </span>{" "}
                              <span
                                className={`font-normal ${
                                  isDark ? "text-gray-300" : "text-[#444]"
                                }`}
                              >
                                — {comment.text}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(
                                new Date(comment.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      ))}

                      {!fullCommentsVisible &&
                        interactions[selectedPost._id].comments.length > 3 && (
                          <div className="text-center">
                            <button
                              onClick={() => setFullCommentsVisible(true)}
                              className="text-[#288683] hover:underline mt-2 text-sm"
                            >
                              Show more comments
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  {formatDistanceToNow(new Date(selectedPost.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleDeletePost(selectedPost._id)}
                    className="text-red-600 hover:underline flex items-center gap-1"
                  >
                    <FaTrash /> <span>Delete</span>
                  </button>
                  <button
                    onClick={() => handleEditPost(selectedPost._id)}
                    className="text-green-600 hover:underline flex items-center gap-1"
                  >
                    <FaEdit /> <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
