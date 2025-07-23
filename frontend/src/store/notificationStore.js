import { create } from "zustand";
import axios from "axios";
import { useSocketStore } from "./socketStore";

export const useNotificationStore = create((set) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("http://localhost:2057/api/notifications", {
        withCredentials: true,
      });
      set({ notifications: res.data, loading: false });
    } catch (err) {
      console.error("Error:", err);
      set({ loading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await axios.patch(
        `http://localhost:2057/api/notifications/mark-read/${id}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Error:", err);
    }
  },

  pushNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  updateNotificationResponse: (id, status) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, responded: status } : n
      ),
    })),

  // Real-time listener
  initSocket: () => {
    const { socket } = useSocketStore.getState();

    if (!socket) return;
    console.log("Listening for notifications...");

    socket.on("receive_notification", (notification) => {
      const { user } = useAuthStore.getState();
      if (!user || user._id !== notification.recipient) return; // discard if not intended for current user

      set((state) => ({
        notifications: [notification, ...state.notifications],
      }));
    });

    // ✅ Listen for removed notifications
    socket.on("remove_notification", ({ requestId, type }) => {
      console.log("Removing notification:", requestId, type);
      set((state) => ({
        notifications: state.notifications.filter(
          (n) => !(n.requestId === requestId && n.type === type)
        ),
      }));
    });
  },
}));
