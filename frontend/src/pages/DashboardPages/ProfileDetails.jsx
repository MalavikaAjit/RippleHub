import axios from "axios";
import React, { useState, useEffect } from "react";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import { useProfileStore } from "../../store/profileStore";
import { FaUser, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ProfileDetails = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const { user } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();

  const [profileImage, setProfileImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [bio, setBio] = useState("");
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) fetchProfile(user._id);
  }, [user]);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
      setProfileImage(profile.profileImage || "");
    }
  }, [profile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const renderImageSrc = () => {
    if (!profileImage) return null;
    if (profileImage.startsWith("blob:") || profileImage.startsWith("http")) {
      return profileImage;
    }
    return `http://localhost:2057${profileImage}`;
  };

  const handleSave = async () => {
    setUpdating(true);
    const formData = new FormData();
    formData.append("bio", bio);
    if (imageFile) formData.append("profileImage", imageFile);

    try {
      await axios.put(
        "http://localhost:2057/api/user/update-profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      await fetchProfile(user._id);
      toast.success("Profile updated!");
      navigate("/profile", { state: { forceRefresh: true } });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div
      className={`min-h-screen px-4 py-6 ${
        isDark ? "bg-[#111] text-white" : "bg-[#f3f6fa] text-gray-900"
      }`}
    >
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-[#288683] text-white rounded-md"
        >
          <FaArrowLeft /> Back
        </button>

        <h2 className="text-2xl font-semibold text-center">Edit Profile</h2>

        {/* Profile Picture */}
        <div className="space-y-2">
          <label
            className={`block font-medium ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Profile Picture
          </label>
          <div className="w-24 h-24 rounded-full overflow-hidden border bg-white dark:bg-gray-800 flex items-center justify-center">
            {renderImageSrc() ? (
              <img
                src={renderImageSrc()}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="text-4xl text-gray-400" />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-[#288683] file:font-semibold
              file:bg-[#d1f4f2]
              hover:file:bg-[#bfe4e1]"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label
            className={`block font-medium ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Bio
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={`w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#288683] ${
              isDark
                ? "bg-[#1c1c1c] border-gray-700 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
            placeholder="Write your bio..."
          />
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSave}
            disabled={updating}
            className={`bg-[#288683] text-white px-6 py-2 rounded-md transition ${
              updating ? "opacity-50 cursor-not-allowed" : "hover:bg-[#1c5e5a]"
            }`}
          >
            {updating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
