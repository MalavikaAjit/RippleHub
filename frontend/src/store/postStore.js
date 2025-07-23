import { create } from "zustand";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:2057";

const usePostStore = create((set) => ({
  isLoading: false,
  error: null,
  success: null,
  posts: [],

  uploadPost: async (formData) => {
    set({ isLoading: true, error: null, success: null });
    try {
      const response = await axios.post(`${baseUrl}/api/posts`, formData, {
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
      const response = await axios.get(`${baseUrl}/api/posts`, {
        withCredentials: true,
      });

      // Extract the posts array from the response
      const postsArray = response.data.posts || [];

      console.log("Extracted posts:", postsArray);
      set({
        isLoading: false,
        posts: postsArray,
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

  deletePost: async (postId) => {
    set({ isLoading: true, error: null, success: null });
    try {
      await axios.delete(`${baseUrl}/api/posts/${postId}`, {
        withCredentials: true,
      });
      set((state) => ({
        posts: state.posts.filter((p) => p._id !== postId),
        success: "Post deleted successfully",
        isLoading: false,
      }));
    } catch (err) {
      console.error("Delete post failed:", err);
      set({ error: "Failed to delete post", isLoading: false });
    }
  },
  updatePost: async (postId, formData) => {
    set({ isLoading: true, error: null, success: null });
    try {
      const res = await axios.put(`${baseUrl}/api/posts/${postId}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        posts: state.posts.map((p) =>
          p._id === postId ? res.data.updatedPost : p
        ),
        isLoading: false,
        success: "Post updated successfully!",
      }));

      return res.data.updatedPost;
    } catch (error) {
      console.error("Update post error:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || error.message,
        success: null,
      });
      throw error;
    }
  },

  clearMessages: () => {
    set({ error: null, success: null });
  },
}));

export default usePostStore;
