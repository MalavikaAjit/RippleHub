import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaImages, FaSpinner } from "react-icons/fa";
import usePostStore from "../../store/postStore";
import { useThemeStore } from "../../store/themeStore";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:2057";

const UploadEditPage = () => {
  const { isDark } = useThemeStore();
  const {
    posts,
    isLoading,
    error,
    success,
    updatePost,
    clearMessages,
    fetchPost,
  } = usePostStore();
  const navigate = useNavigate();
  const { postId } = useParams();

  // Find the post to edit
  const post = posts.find((p) => p._id === postId);

  // State for form fields
  const [caption, setCaption] = useState(post?.caption || "");
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(post?.post_image || []);

  useEffect(() => {
    if (!post && !isLoading) {
      fetchPost(); // or fetchPosts()
    }
  }, [post, isLoading, fetchPost]);

  useEffect(() => {
    if (!postId) {
      console.log("No postId provided");
      navigate("/profile");
      return;
    }
    if (!post && !isLoading) {
      console.log("Fetching post for ID:", postId);
      fetchPost(postId);
    }
    if (!post && !isLoading && error) {
      console.log("Error fetching post:", error);
      navigate("/profile");
    }
  }, [post, isLoading, error, postId, fetchPost, navigate]);

  useEffect(() => {
    if (!post && !isLoading) {
      fetchPost(postId); // ✅
    }
  }, [post, isLoading, postId, fetchPost]);

  useEffect(() => {
    // Clear success/error messages after 3 seconds
    if (success || error) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, clearMessages]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("imagePaths", JSON.stringify(existingImages));

    images.forEach((image) => {
      formData.append("post_image", image);
    });

    try {
      await updatePost(postId, formData); // this will hit postStore.js
      navigate("/profile");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div
      className={`min-h-screen px-4 py-6 sm:px-6 md:px-8 ${
        isDark ? "bg-[#111111]" : "bg-[#f3f6fa]"
      }`}
    >
      <div className="max-w-md mx-auto">
        <h2
          className={`text-2xl font-bold mb-6 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          Edit Post
        </h2>

        {(success || error) && (
          <div
            className={`mb-4 px-4 py-2 rounded-md text-white text-sm font-medium ${
              success ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {success || error}
          </div>
        )}

        {isLoading && (
          <p className={isDark ? "text-white" : "text-gray-700"}>Loading...</p>
        )}

        {!isLoading && post && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="caption"
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Caption
              </label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className={`mt-1 w-full p-2 border rounded-md ${
                  isDark ? "bg-[#1e1e1e] text-white" : "bg-white text-gray-800"
                }`}
                rows="4"
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Current Images
              </label>
              {existingImages.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {existingImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={
                          img.startsWith("http")
                            ? img
                            : `${baseUrl}/Uploads/${img}`
                        }
                        alt={`Existing image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full"
                        aria-label="Remove image"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  No images currently.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="images"
                className={`block text-sm font-medium ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Add New Images
              </label>
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className={`mt-1 w-full p-2 border rounded-md ${
                  isDark ? "bg-[#1e1e1e] text-white" : "bg-white text-gray-800"
                }`}
              />
              {images.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 py-2 px-4 rounded-md text-white flex items-center justify-center gap-2 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#288683] hover:bg-[#1c5e5a]"
                }`}
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaImages />
                )}
                {isLoading ? "Updating..." : "Update Post"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 py-2 px-4 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UploadEditPage;
