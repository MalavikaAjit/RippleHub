import { create } from "zustand";
import axios from "axios";

export const useFriendRequestStore = create((set) => ({
  requests: [],
  loading: false,

  sendRequest: async (receiverId) => {
    try {
      const res = await axios.post(
        "http://localhost:2057/api/friend-request/send",
        { receiver: receiverId },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      console.error("Error sending request", err);
      throw err;
    }
  },

  respondToRequest: async (requestId, action) => {
    try {
      const res = await axios.patch(
        `http://localhost:2057/api/friend-request/respond/${requestId}`,
        { action },
        { withCredentials: true }
      );
      const updated = res.data.updatedRequest;
      set((state) => ({
        requests: state.requests.map((r) =>
          r._id === requestId ? { ...r, status: updated.status } : r
        ),
      }));
      return updated.status;
    } catch (err) {
      console.error("Error responding to request", err);
      throw err;
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
    } catch (err) {
      console.error("Error cancelling request", err);
      throw err;
    }
  },
}));
