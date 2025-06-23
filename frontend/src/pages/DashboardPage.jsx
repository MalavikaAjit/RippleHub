import React from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLogout = async () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#e0f2f1] to-[#b2dfdb] px-4 font-roboto">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
        <img
          src="/assets/logo_png.png"
          alt="RippleHub Logo"
          className="mx-auto w-16 mb-6"
        />

        <h1 className="text-3xl font-bold text-[#288683] mb-4">
          Welcome, {`${user?.firstName || ""}`}!
        </h1>

        <p className="text-gray-700 text-base mb-6">
          This is your dashboard. Here you can manage your account access the
          RippleHub Social Media application.
        </p>

        <div className="bg-[#f4f1f8] rounded-lg px-4 py-3 text-left text-sm text-gray-700 space-y-2">
          <p>
            <span className="font-semibold text-[#288683]">Email:</span>{" "}
            {user?.email || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-[#288683]">Name:</span>{" "}
            {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-[#288683]">Joined Date:</span>{" "}
            {formatDate(user?.createdAt)}
          </p>
          <p>
            <span className="font-semibold text-[#288683]">Last Login:</span>{" "}
            {formatDate(user?.lastLogin)}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;