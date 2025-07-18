import React, { useState, useEffect } from "react";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore} from "../../store/authStore";
import { useProfileStore } from "../../store/profileStore"; // Import the profile store
import { FaUser } from "react-icons/fa";

const ProfileDetails = () => {
  const isDark = useThemeStore((state) => state.isDark);
  const { user } = useAuthStore();
  const { profile, loading, error, fetchProfile, updateProfile } = useProfileStore();

  const [profileImage, setProfileImage] = useState(""); // Preview URL
  const [imageFile, setImageFile] = useState(null); // Actual file
  const [bio, setBio] = useState("");

  // Fetch profile when component mounts
  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  // Update local state when profile is fetched
  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
      setProfileImage(profile.profile_image || "");
    }
  }, [profile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);
      setImageFile(file); // Store the file for upload
    }
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleSave = async () => {
    if (!user?.id) {
      alert("User not authenticated");
      return;
    }

    try {
      const response = await createProfile({
        userId: user.id,
        bio,
        profileImage: imageFile,
      });
      console.log("Saving profile...");
      console.log("Bio:", bio);
      console.log("Image:", profileImage);
      alert(response.message || "Profile saved successfully");
    } catch (error) {
      alert("Failed to save profile");
    }
  };

  return (
    <div
      className={`min-h-screen px-4 py-6 sm:px-6 md:px-8 transition duration-300 ${
        isDark ? "bg-[#111111] text-white" : "bg-[#f3f6fa] text-black"
      }`}
    >
      <div className="max-w-3xl mx-auto w-full space-y-8">
        <h2 className="text-2xl font-semibold text-center">Edit Profile</h2>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Profile Image */}
        <div className="space-y-2">
          <label className="block font-medium">Profile Picture</label>
          <div className="h-24 w-24 rounded-full border-2 border-gray-300 bg-gray-100 overflow-hidden flex items-center justify-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <FaUser className="text-4xl text-gray-400" />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Bio Section */}
        <div className="space-y-2">
          <label className="block font-medium">Bio</label>
          <textarea
            value={bio}
            onChange={handleBioChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Define yourself, ripplers..."
          ></textarea>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;