import { create } from "zustand";
import { io } from "socket.io-client";

let socketInstance = null;

export const useSocketStore = create(() => {
  if (!socketInstance) {
    socketInstance = io("http://localhost:2057", {
      withCredentials: true,
      transports: ["websocket"],
    });
  }

  return { socket: socketInstance };
});
