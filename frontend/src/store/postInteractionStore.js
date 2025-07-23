import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:2057/api";

export const usePostInteractionStore = create((set) => ({
  interactions: {},

  fetchInteractions: async (postId) => {
    try {
      const res = await axios.get(`${API_URL}/interactions/${postId}`, {
        withCredentials: true,
      });

      set((state) => ({
        interactions: {
          ...state.interactions,
          [postId]: res.data, // includes likes + comments
        },
      }));
    } catch (err) {
      console.error("Error fetching interactions:", err);
    }
  },

  toggleLike: async (postId) => {
    try {
      const res = await axios.post(
        `${API_URL}/like/${postId}`,
        {},
        { withCredentials: true }
      );

      // ✅ Update the count in store without refetching
      set((state) => ({
        interactions: {
          ...state.interactions,
          [postId]: {
            ...state.interactions[postId],
            isLiked: res.data.liked,
            likesCount: res.data.likesCount, // <- ✅ update here
          },
        },
      }));
    } catch (err) {
      console.error("Like error:", err);
    }
  },

  addComment: async (postId, text) => {
    try {
      await axios.post(
        `${API_URL}/comment/${postId}`,
        { text },
        { withCredentials: true }
      );
      // Re-fetch interactions after adding comment
      await usePostInteractionStore.getState().fetchInteractions(postId);
    } catch (err) {
      console.error("Comment error:", err);
    }
  },
}));
