import { create } from "zustand";
import axios from "axios";

export const useProfileStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,

  // Fetch profile
  fetchProfile: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("http://localhost:2057/api/profile/getprofile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming JWT token for auth
        },
      });
      set({ profile: response.data.profile, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || "Failed to fetch profile", loading: false });
    }
  },

  // Update or create profile
  createProfile: async ({ userId, bio, profileImage }) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("bio", bio);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await axios.post(
        "http://localhost:2057/api/profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      set({ profile: response.data.profile, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || "Failed to update profile", loading: false });
      throw error;
    }
  },

  // Clear profile (optional, e.g., for logout)
  clearProfile: () => set({ profile: null, error: null, loading: false }),
}));