import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../store/themeStore";

import {
  FaHome,
  FaBell,
  FaEnvelope,
  FaCog,
  FaUpload,
  FaSignOutAlt,
  FaBars,
  FaSearch,
} from "react-icons/fa";

const Navbar = ({ isCollapsed, setIsCollapsed }) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { isDark } = useThemeStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleNavbar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-60"
      } fixed top-0 left-0 h-screen transition-all duration-300 z-40 flex flex-col justify-between
        ${
          isDark
            ? "bg-[#121212] text-gray-100 border-gray-800"
            : "bg-white text-gray-800 border-gray-200"
        }
        shadow-lg border-r`}
    >
      {/* Top Section */}
      <div
        className={`border-b px-4 py-3 flex items-center justify-between h-[81px] 
        ${isDark ? "border-gray-700" : "border-gray-200"}`}
      >
        {!isCollapsed ? (
          <>
            <h1
              className={`text-lg font-bold ${
                isDark ? "text-[#27b1ab]" : "text-[#288683]"
              }`}
            >
              RippleHub
            </h1>
            <button
              onClick={toggleNavbar}
              className={`text-xl transition-colors ${
                isDark
                  ? "text-[#27b1ab] hover:text-white"
                  : "text-[#288683] hover:text-[#1c5e5a]"
              }`}
            >
              <FaBars />
            </button>
          </>
        ) : (
          <button
            onClick={toggleNavbar}
            className={`w-full flex justify-center text-xl transition-colors ${
              isDark
                ? "text-[#27b1ab] hover:text-white"
                : "text-[#288683] hover:text-[#1c5e5a]"
            }`}
          >
            <FaBars />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 flex flex-col items-start px-2 pt-4">
        <ul className="space-y-1 w-full">
          {[
            { label: "Home", icon: <FaHome />, path: "/" },
            { label: "Notifications", icon: <FaBell />,path: "/notifications"},
            {label: "Find Them" ,icon: <FaSearch/>, path: "/find"},
            { label: "Messages", icon: <FaEnvelope />, path: "/messages" },
            { label: "Settings", icon: <FaCog />, path: "/settings" },
            { label: "Upload", icon: <FaUpload />, path: "/upload" },
            
          ].map(({ label, icon, path }) => (
            <li key={label}>
              <button
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 p-3 rounded-md text-[15px] ${
                  isCollapsed ? "justify-center" : "justify-start"
                } transition-colors
                ${
                  isDark
                    ? "text-[#27b1ab] hover:bg-[#1c5e5a] hover:text-white"
                    : "text-[#288683] hover:bg-[#288683] hover:text-white"
                }`}
                title={isCollapsed ? label : ""}
              >
                <span className="text-lg">{icon}</span>
                {!isCollapsed && label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Section */}
      <div
        className={`p-4 space-y-2 border-t ${
          isDark ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-md text-red-600 hover:bg-red-600 hover:text-white transition text-[15px] justify-start"
          title="Logout"
        >
          <FaSignOutAlt className="text-lg" />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
