import React, { useEffect, useState } from "react";
import { FaUpload, FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import { useThemeStore } from "../../store/themeStore";
import usePostStore from "../../store/postStore";

const UploadPage = () => {
  const { isDark } = useThemeStore();
  const { isLoading, error, success, uploadPost, clearMessages } = usePostStore();

  const [caption, setCaption] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [...images, ...files];
      const newPreviews = [
        ...imagePreviews,
        ...files.map((file) => URL.createObjectURL(file)),
      ];
      console.log("Selected files:", newImages.map((file) => file.name));
      setImages(newImages);
      setImagePreviews(newPreviews);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
    setImages(newImages);
    setImagePreviews(newPreviews);
    if (newImages.length === 0) {
      document.getElementById("dropzone-file").value = "";
    }
  };

  const handlePost = async () => {
    if (images.length === 0) {
      alert("Please select at least one image");
      return;
    }

    const formData = new FormData();
    images.forEach((image) => formData.append("post_image", image)); // Changed to "post_image"
    formData.append("caption", caption);
    formData.append("privacy", privacy);

    console.log("Posting data:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }

    try {
      await uploadPost(formData);
      setCaption("");
      setPrivacy("public");
      setImages([]);
      setImagePreviews([]);
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      document.getElementById("dropzone-file").value = "";
    } catch (error) {
      console.error("Post failed:", error.message);
    }
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => clearMessages(), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, clearMessages]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  return (
    <div
      className={`min-h-screen px-4 py-6 sm:px-6 md:px-8 transition duration-300 ${
        isDark ? "bg-[#111111]" : "bg-[#f3f6fa]"
      }`}
    >
      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <FaUpload className="text-[#288683] text-xl sm:text-2xl" />
          <h2
            className={`text-xl sm:text-2xl font-extrabold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Upload Content
          </h2>
        </div>

        {success && (
          <div
            className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg text-sm"
            role="alert"
          >
            {success}
          </div>
        )}
        {error && (
          <div
            className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="space-y-5 sm:space-y-6">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className={`flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed rounded-lg cursor-pointer transition relative overflow-y-auto ${
                isDark
                  ? "bg-white border-gray-500 hover:bg-gray-100"
                  : "bg-[#f9f9f9] border-gray-300 hover:bg-gray-200"
              }`}
              aria-describedby="file-upload-description"
            >
              {imagePreviews.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2 w-full">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative flex items-center justify-center"
                    >
                      <img
                        src={preview}
                        alt={`Selected preview ${index + 1}`}
                        className="max-h-24 max-w-full object-contain"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                        aria-label={`Remove image ${index + 1}`}
                        disabled={isLoading}
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaCloudUploadAlt
                    className={`w-10 h-10 mb-3 sm:mb-4 ${
                      isDark ? "text-gray-700" : "text-gray-500"
                    }`}
                  />
                  <p
                    className={`mb-1 sm:mb-2 text-sm text-center ${
                      isDark ? "text-gray-700" : "text-gray-600"
                    }`}
                  >
                    <span className="font-semibold">Click to upload</span> or drag
                    and drop
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-600" : "text-gray-500"
                    }`}
                    id="file-upload-description"
                  >
                    JPG, PNG, GIF (MAX. 800x400px)
                  </p>
                </div>
              )}
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageChange}
                disabled={isLoading}
                multiple
                aria-required="true"
              />
            </label>
          </div>

          <div>
            <label
              htmlFor="caption"
              className={`block mb-2 text-sm font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Caption
            </label>
            <textarea
              id="caption"
              rows="4"
              className={`block w-full p-3 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition ${
                isDark
                  ? "bg-white text-gray-900 border-gray-400"
                  : "bg-[#f9f9f9] text-gray-800 border-gray-300"
              }`}
              placeholder="Write your thoughts here..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={isLoading}
              aria-describedby="caption-description"
            />
            <p id="caption-description" className="sr-only">
              Enter a caption for your uploaded image
            </p>
          </div>

          <div>
            <label
              htmlFor="privacy"
              className={`block mb-2 text-sm font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
              aria-required="true"
            >
              Privacy
            </label>
            <select
              id="privacy"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className={`w-full p-3 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition ${
                isDark
                  ? "bg-white text-gray-900 border-gray-400"
                  : "bg-[#f9f9f9] text-gray-800 border-gray-300"
              }`}
              disabled={isLoading}
              aria-describedby="privacy-description"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
            <p id="privacy-description" className="sr-only">
              Select the privacy setting for your post
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handlePost}
              disabled={isLoading}
              className={`bg-[#288683] hover:bg-[#1e6e66] text-white font-semibold px-8 py-3 rounded-lg text-sm sm:text-base transition w-full sm:w-auto ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Post content"
            >
              {isLoading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;