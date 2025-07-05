import {create} from "zustand";

import axios from "axios";

const API_URL = "http://localhost:2057/api";

axios.defaults.withCredentials = true; // allows us to send cookies with requests

const usePostStore = create((set) => ({
  
  isLoading: false,
  error: null,
  success: null,

  uploadPost: async (formData) => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload post");
      }

      const result = await response.json();
      set({ isLoading: false, success: "Post uploaded successfully!", error: null });
      return result;
    } catch (error) {
      set({ isLoading: false, error: error.message, success: null });
      throw error;
    }
  },

  fetchPost: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch posts");
      }

      const posts = await response.json();
      set({ isLoading: false, posts: posts || [], error: null }); // Ensure posts is an array
      return posts;
    } catch (error) {
      console.error("Fetch post error:", error);
      set({ isLoading: false, error: error.message, posts: [] });
      throw error;
    }
  },

  clearMessages: () => set({ error: null, success: null }),
}));

export default usePostStore;

