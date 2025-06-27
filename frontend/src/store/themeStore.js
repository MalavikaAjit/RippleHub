import { create } from "zustand";

export const useThemeStore = create((set) => ({
  isDark: false,
  toggleDark: () =>
    set((state) => {
      const newVal = !state.isDark;
      if (newVal) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return { isDark: newVal };
    }),
}));
