import React from "react";
import { FaSearch } from "react-icons/fa";
import { useThemeStore } from "../../store/themeStore";

const FindPage = () =>{
    const { isDark,toggleDark } = useThemeStore();
    return (
        <div
              className={`min-h-screen px-4 py-6 sm:px-6 md:px-8 transition duration-300 ${
                isDark ? "bg-[#111111]" : "bg-[#f3f6fa]"
              }`}
            >
                <div className="max-w-3xl mx-auto w-full">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <FaSearch className="text-[#288683] text-xl sm:text-2xl" />
                    <h2
                        className={`text-xl sm:text-2xl font-extrabold ${
                        isDark ? "text-white" : "text-gray-800"
                        }`}
                    >
                       Find Them
                    </h2>
                    </div>
                    </div>
                    <div className="flex justify-center w-full">
                    <div className="relative w-full max-w-md">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
                        <FaSearch />
                        </span>
                        <input
                        type="text"
                        placeholder="Search Ripples..."
                        className={`w-full pl-10 pr-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#27b1ab] text-sm
                        ${
                            isDark
                            ? "bg-[#2a2a2a] border-gray-600 text-gray-200"
                            : "bg-white border-gray-200 text-gray-800"
                        }`}
                        />
                    </div>
                    </div>
        
        </div>
    );
};

export default FindPage;