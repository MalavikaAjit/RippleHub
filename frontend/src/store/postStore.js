import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:2057/api";

axios.defaults.withCredentials = true; // Send cookies with every request

const usePostStore = create((set) => ({
  isLoading: false,
  error: null,
  success: null,
  posts: [],

  uploadPost: async (formData) => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await axios.post(`${API_URL}/posts`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set({
        isLoading: false,
        success: "Post uploaded successfully!",
        error: null,
      });

      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message,
        success: null,
      });
      throw error;
    }
  },

 fetchPost: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/posts`, {
        withCredentials: true,
      });
      
      // Extract the posts array from the response
      const postsArray = response.data.posts || [];
      
      console.log("Extracted posts:", postsArray);
      set({
        isLoading: false,
        posts: postsArray, // Store the actual posts array
        error: null,
      });
      return postsArray;
    } catch (error) {
      console.error("Fetch post error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message,
        posts: [],
      });
      throw error;
    }
  },
  clearMessages: () => set({ error: null, success: null }),
}));

export default usePostStore;
