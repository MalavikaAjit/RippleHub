import React from "react";
import { FaUpload, FaCloudUploadAlt } from "react-icons/fa";
import { useThemeStore } from "../../store/themeStore";

const UploadPage = () => {
  const { isDark,toogleDrak } = useThemeStore();

  const [caption, setCaption] = React.useState("");
  const [privacy, setPrivacy] = React.useState("public");
  const [image, setImage] = React.useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handlePost = (e) => {
    e.preventDefault();

    const postData = {
      caption,
      privacy,
      image,
    };
    console.log("Posting content:", postData);
    alert("Content Posted!");
  };

  return (
    <div
      className={`min-h-screen px-4 py-6 sm:px-6 md:px-8 transition duration-300 ${
        isDark ? "bg-[#111111]" : "bg-[#f3f6fa]"
      }`}
    >
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
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

        {/* Upload Form */}
        <form onSubmit={handlePost} className="space-y-5 sm:space-y-6">
          {/* Dropzone */}
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className={`flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed rounded-lg cursor-pointer ${
                isDark
                  ? "bg-white border-gray-500 hover:bg-gray-100"
                  : "bg-[#f9f9f9] border-gray-300 hover:bg-gray-200"
              }`}
            >
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
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-600" : "text-gray-500"
                  }`}
                >
                  JPG, PNG, GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Caption Field */}
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
              className={`block w-full p-3 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                isDark
                  ? "bg-white text-gray-900 border-gray-400"
                  : "bg-[#f9f9f9] text-gray-800 border-gray-300"
              }`}
              placeholder="Write your thoughts here..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          {/* Privacy Select */}
          <div>
            <label
              htmlFor="privacy"
              className={`block mb-2 text-sm font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Privacy
            </label>
            <select
              id="privacy"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className={`w-full p-3 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                isDark
                  ? "bg-white text-gray-900 border-gray-400"
                  : "bg-[#f9f9f9] text-gray-800 border-gray-300"
              }`}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>

          {/* Post Button Centered */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#288683] hover:bg-[#1e6e66] text-white font-semibold px-8 py-3 rounded-lg text-sm sm:text-base transition w-full sm:w-auto"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;
