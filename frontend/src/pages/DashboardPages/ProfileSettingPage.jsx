import React, { useState } from "react";
import { useThemeStore } from "../../store/themeStore"; // Adjust path to your themeStore
import { useAuthStore } from "../../store/authStore"; // Adjust path to your authStore

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
            onChange={(e) => setFirstName(e.target.value)}
            className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm ${
              isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"
            }`}
            placeholder="Enter your first name"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm ${
              isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"
            }`}
            placeholder="Enter your last name"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm ${
              isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"
            }`}
            placeholder="Enter your email"
          />
        </div>

        <div className="text-center">
          <button
            onClick={handleUserDetailsSave}
            disabled={isLoading}
            className={`${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold px-6 py-2 rounded-lg transition duration-200`}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
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

  const handleSecuritySave = async () => {
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    try {
      await updatePassword(currentPassword, newPassword);
      setSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(authError || "Failed to update password.");
    }
  };

  return (
    <div className="space-y-6">

      {error && <p className="text-red-600 text-center">{error}</p>}
      {success && <p className="text-green-600 text-center">{success}</p>}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 text-sm ${
              isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"
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
            className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 text-sm ${
              isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"
            }`}
            placeholder="Enter new password"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 text-sm ${
              isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"
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
                : "bg-green-600 hover:bg-green-700"
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

  // Format date for display
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

  return (
    <div className="space-y-6">

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Profile Created</label>
          <input
            type="text"
            value={formatDate(user?.createdAt)}
            readOnly
            className={`w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-sm ${
              isDark ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-black border-gray-300"
            }`}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Last Login</label>
          <input
            type="text"
            value={formatDate(user?.lastLogin)}
            readOnly
            className={`w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-sm ${
              isDark ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-black border-gray-300"
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

  return (
    <div
      className={`min-h-screen px-4 py-8 sm:px-6 md:px-8 transition duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div className="max-w-3xl mx-auto w-full space-y-8">
        {/* Navigation Bar */}
        <div className="flex justify-center space-x-4 border-b border-gray-300 dark:border-gray-600 bg-green-100 dark:bg-green-900/50 rounded-lg shadow-sm p-2">
          <button
            onClick={() => setActiveTab("user-details")}
            className={`py-2 px-4 font-semibold rounded-md transition duration-200 ${
              activeTab === "user-details"
                ? "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 border-b-2 border-gray-400"
                : isDark
                ? "text-gray-300 hover:text-white hover:bg-green-800"
                : "text-gray-700 hover:text-black hover:bg-green-200"
            }`}
          >
            User Details
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`py-2 px-4 font-semibold rounded-md transition duration-200 ${
              activeTab === "security"
                ? "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 border-b-2 border-gray-400"
                : isDark
                ? "text-gray-300 hover:text-white hover:bg-green-800"
                : "text-gray-700 hover:text-black hover:bg-green-200"
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab("login-information")}
            className={`py-2 px-4 font-semibold rounded-md transition duration-200 ${
              activeTab === "login-information"
                ? "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 border-b-2 border-gray-400"
                : isDark
                ? "text-gray-300 hover:text-white hover:bg-green-800"
                : "text-gray-700 hover:text-black hover:bg-green-200"
            }`}
          >
            Login Information
          </button>
        </div>

        {/* Tab Content */}
        <div className={`p-6 rounded-lg shadow-md ${isDark ? "bg-gray-800" : "bg-white"}`}>
          {activeTab === "user-details" && <UserDetails />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "login-information" && <LoginInformation />}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;