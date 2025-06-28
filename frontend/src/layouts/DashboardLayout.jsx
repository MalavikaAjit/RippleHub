import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#f3f6fa] font-sans">
      <Navbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className={`flex-1 overflow-auto relative transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-60"
        }`}
      >
        <Outlet context={{ isCollapsed }} />
      </div>
    </div>
  );
};

export default DashboardLayout;
