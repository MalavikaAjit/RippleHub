import React from "react";
import {
  FaMoon,
  FaSun,
  FaUserLock,
  FaBell,
  FaLanguage,
  FaCogs,
} from "react-icons/fa";
import { useThemeStore } from "../../store/themeStore"; // Adjust path as needed

const SettingPage = () => {
  const { isDark, toggleDark } = useThemeStore();

  return (
    <div
      className={`min-h-screen p-6 transition duration-300 ${
        isDark ? "bg-[#121212]" : "bg-[#f3f6fa]"
      }`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FaCogs className="text-[#288683] text-2xl" />
          <h2
            className={`text-2xl font-extrabold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Settings & Preferences
          </h2>
        </div>

        {/* Card Wrapper */}
        <div className="space-y-6">
          {/* Appearance */}
          <div
            className={`rounded-2xl border ${
              isDark
                ? "border-gray-700 bg-[#1e1e1e]"
                : "border-gray-100 bg-white"
            } p-6 shadow-md`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3
                className={`text-lg font-semibold flex items-center gap-2 ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                <FaMoon /> Appearance
              </h3>
              <button
                onClick={toggleDark}
                className={`relative w-14 h-7 flex items-center rounded-full px-1 transition ${
                  isDark ? "bg-[#288683]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute left-1 transform transition-transform duration-300 ${
                    isDark ? "translate-x-7" : "translate-x-0"
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center">
                    {isDark ? (
                      <FaMoon className="text-[#288683]" />
                    ) : (
                      <FaSun className="text-yellow-400" />
                    )}
                  </div>
                </div>
              </button>
            </div>
            <p
              className={`text-sm ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Toggle dark mode for the entire app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
