import React from "react";
import { FaCheckCircle, FaCog, FaEdit } from "react-icons/fa";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";

const ProfilePage = () => {
  const { isDark } = useThemeStore();
  const { user } = useAuthStore();

  // Dummy post images
  const ripplePosts = [
    "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa",
    "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759",
    "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
  ];

  return (
    <div
      className={`min-h-screen px-4 py-6 sm:px-6 md:px-8 transition duration-300 ${
        isDark ? "bg-[#111111]" : "bg-[#f3f6fa]"
      }`}
    >
      <div className="max-w-5xl mx-auto w-full space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          {/* Left - Profile Info */}
          <div className="flex gap-5 items-center">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-[#288683] shadow-md"
            />
            <div>
              <h3
                className={`text-xl font-bold flex items-center gap-2 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                {user?.firstName} {user?.lastName}
                {user?.isVerified && (
                  <FaCheckCircle className="text-[#288683]" />
                )}
              </h3>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Experienced coder specializing in Python and JavaScript, with a focus on developing scalable web applications. 
                Enjoy the challenge of optimizing code for performance and building user-friendly interfaces.
              </p>
              <div className="flex gap-4 mt-2 text-sm font-medium">
                <p className={isDark ? "text-white" : "text-gray-700"}>
                  Posts: <span className="font-bold">24</span>
                </p>
                <p className={isDark ? "text-white" : "text-gray-700"}>
                  Friends: <span className="font-bold">136</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right - Actions */}
          <div className="flex gap-3">
            <button className="px-3 py-2 bg-[#288683] text-white text-sm rounded-md hover:bg-[#1c5e5a] flex items-center gap-1">
              <FaEdit /> Edit
            </button>
            <button className="px-3 py-2 bg-gray-300 text-gray-800 text-sm rounded-md hover:bg-gray-400 flex items-center gap-1">
              <FaCog /> Settings
            </button>
          </div>
        </div>

        {/* Divider Title */}
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

        {/* Ripple Images Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {ripplePosts.map((img, idx) => (
            <div
              key={idx}
              className={`rounded-lg overflow-hidden shadow-sm ${
                isDark ? "bg-[#1e1e1e]" : "bg-white"
              }`}
            >
              <img
                src={img}
                alt={`Ripple ${idx + 1}`}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;





 {/* {user ? (
          <div
            className={`rounded-xl p-6 shadow-md ${
              isDark
                ? "bg-[#1c1c1c] text-white border border-[#333]"
                : "bg-white text-gray-800 border border-gray-200"
            }`}
          >
            <div className="space-y-4 text-sm sm:text-base">
              <p>
                <span className="font-semibold">Name:</span>  {user?.firstName}{" "}
                      {user?.lastName}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p className="flex items-center gap-1">
                <span className="font-semibold">Verified:</span>{" "}
                {user.isVerified ? (
                  <>
                    Yes <FaCheckCircle className="text-green-500" />
                  </>
                ) : (
                  "No"
                )}
              </p>
              <p>
                <span className="font-semibold">Joined:</span>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <p className={`${isDark ? "text-white" : "text-gray-700"} text-sm`}>
            Loading user profile...
          </p>
        )} */}