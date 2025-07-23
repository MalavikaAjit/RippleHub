import React, { useState } from "react";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Format date utility
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const UserDetails = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const { user, updateProfile, isLoading, error: authError } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUserDetailsSave = async () => {
    setError("");
    setSuccess("");

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("First name, last name, and email are required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await updateProfile(firstName, lastName, email);
      setSuccess("User details updated successfully!");
    } catch (error) {
      setError(authError || "Failed to update user details.");
    }
  };

  return (
    <div className="space-y-6">
      {error && <p className="text-red-600 text-center">{error}</p>}
      {success && <p className="text-green-600 text-center">{success}</p>}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">First Name</label>
          <input
            type="text"
            value={firstName}
            readOnly
            onChange={(e) => setFirstName(e.target.value)}
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 text-sm ${
              isDark
                ? "bg-gray-800 text-white border-gray-600 focus:ring-blue-400"
                : "bg-white text-black border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Enter your first name"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Last Name</label>
          <input
            type="text"
            value={lastName}
            readOnly
            onChange={(e) => setLastName(e.target.value)}
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 text-sm ${
              isDark
                ? "bg-gray-800 text-white border-gray-600 focus:ring-blue-400"
                : "bg-white text-black border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Enter your last name"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 text-sm ${
              isDark
                ? "bg-gray-800 text-white border-gray-600 focus:ring-blue-400"
                : "bg-white text-black border-gray-300 focus:ring-blue-500"
            }`}
            placeholder="Enter your email"
          />
        </div>

        {/* <div className="text-center">
          <button
            onClick={handleUserDetailsSave}
            disabled={isLoading}
            className={`${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-[#288683] hover:bg-[#1c5e5a]"
            } text-white font-semibold px-6 py-2 rounded-lg transition duration-200`}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div> */}
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const { updatePassword, isLoading, error: authError } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSecuritySave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character."
      );
      return;
    }
    try {
      await updatePassword(currentPassword, newPassword);
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update password."
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 text-sm ${
              isDark
                ? "bg-gray-800 text-white border-gray-600 focus:ring-green-400"
                : "bg-white text-black border-gray-300 focus:ring-green-500"
            }`}
            placeholder="Enter current password"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 text-sm ${
              isDark
                ? "bg-gray-800 text-white border-gray-600 focus:ring-green-400"
                : "bg-white text-black border-gray-300 focus:ring-green-500"
            }`}
            placeholder="Enter new password"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 text-sm ${
              isDark
                ? "bg-gray-800 text-white border-gray-600 focus:ring-green-400"
                : "bg-white text-black border-gray-300 focus:ring-green-500"
            }`}
            placeholder="Confirm new password"
          />
        </div>

        <div className="text-center">
          <button
            onClick={handleSecuritySave}
            disabled={isLoading}
            className={`${
              isLoading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-[#288683] hover:bg-[#1c5e5a]"
            } text-white font-semibold px-6 py-2 rounded-lg transition duration-200`}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const LoginInformation = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Profile Created</label>
          <input
            type="text"
            value={formatDate(user?.createdAt)}
            readOnly
            className={`w-full p-2 border rounded-lg bg-gray-100 text-sm ${
              isDark
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-gray-100 text-black border-gray-300"
            }`}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Last Login</label>
          <input
            type="text"
            value={formatDate(user?.lastLogin)}
            readOnly
            className={`w-full p-2 border rounded-lg bg-gray-100 text-sm ${
              isDark
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-gray-100 text-black border-gray-300"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

const ProfileSettingsPage = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const [activeTab, setActiveTab] = useState("user-details");
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-screen px-4 py-8 sm:px-6 md:px-8 transition duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div className="max-w-3xl mx-auto w-full space-y-8">
        {/* Back Button */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-[#288683] text-white rounded-md hover:bg-[#1c5e5a] transition"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 bg-[#288683] rounded-lg shadow-sm p-2">
          <button
            onClick={() => setActiveTab("user-details")}
            className={`py-2 px-4 font-semibold rounded-md transition duration-200 ${
              activeTab === "user-details"
                ? "bg-white text-[#288683]"
                : "text-white/90 hover:text-white"
            }`}
          >
            User Details
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`py-2 px-4 font-semibold rounded-md transition duration-200 ${
              activeTab === "security"
                ? "bg-white text-[#288683]"
                : "text-white/90 hover:text-white"
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab("login-information")}
            className={`py-2 px-4 font-semibold rounded-md transition duration-200 ${
              activeTab === "login-information"
                ? "bg-white text-[#288683]"
                : "text-white/90 hover:text-white"
            }`}
          >
            Login Information
          </button>
        </div>

        {/* Tab Content */}
        <div
          className={`p-6 rounded-lg shadow-md ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          {activeTab === "user-details" && <UserDetails />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "login-information" && <LoginInformation />}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
