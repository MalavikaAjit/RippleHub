import { create } from "zustand";
import axios from "axios";

export const useFriendRequestStore = create((set, get) => ({
  requests: [],
  loading: false,

  sendRequest: async (receiverId) => {
    try {
      const res = await axios.post(
        "http://localhost:2057/api/friend-request/send",
        { receiver: receiverId },
        { withCredentials: true }
      );
      await get().fetchRequests(); // Refresh status after sending
      return res.data;
    } catch (err) {
      console.error("Error sending request", err);
      throw err;
    }
  },

  respondToRequest: async (id, action) => {
    try {
      await axios.patch(
        `http://localhost:2057/api/friend-request/${id}`,
        { action },
        { withCredentials: true }
      );
      await get().fetchRequests(); // Refresh
    } catch (err) {
      console.error("Error responding to request", err);
    }
  },

  fetchRequests: async () => {
    try {
      set({ loading: true });
      const res = await axios.get("http://localhost:2057/api/friend-request", {
        withCredentials: true,
      });
      set({ requests: res.data, loading: false });
    } catch (err) {
      set({ loading: false });
      console.error("Error fetching friend requests", err);
    }
  },

  cancelRequest: async (requestId) => {
    try {
      await axios.delete(
        `http://localhost:2057/api/friend-request/${requestId}`,
        { withCredentials: true }
      );
      await get().fetchRequests();
    } catch (err) {
      console.error("Error cancelling request", err);
      throw err;
    }
  },
}));
