import { create } from "zustand";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:2057";

// Set axios defaults
axios.defaults.withCredentials = true;

export const useProfileStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async (userId) => {
    if (!userId) {
      console.log("fetchProfile: No userId provided");
      set({ error: "User ID is required to fetch profile", loading: false });
      return;
    }
    set({ loading: true, error: null });
    try {
      console.log("Fetching profile for userId:", userId);
      const response = await axios.get(`${baseUrl}/api/user/profile/${userId}`);
      set({ profile: response.data, loading: false, error: null });
      console.log("Profile fetched:", response.data);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch profile";
      console.error("fetchProfile error:", errorMsg, error);
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  updateProfile: async (userId, formData) => {
    if (!userId) {
      console.log("updateProfile: No userId provided");
      set({ error: "User ID is required to update profile", loading: false });
      throw new Error("User ID is required");
    }
    set({ loading: true, error: null });
    try {
      console.log("Updating profile for userId:", userId);
      const response = await axios.put(
        `${baseUrl}/api/user/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set({ profile: response.data, loading: false, error: null });
      console.log("Profile updated:", response.data);
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to update profile";
      console.error("updateProfile error:", errorMsg, error);
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },
}));
