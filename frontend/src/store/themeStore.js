import { create } from "zustand";

export const useThemeStore = create((set) => {
  // Check localStorage or fallback to false
  const stored = localStorage.getItem("theme");
  const isDarkDefault = stored === "dark";

  if (isDarkDefault) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  return {
    isDark: isDarkDefault,
    toggleDark: () =>
      set((state) => {
        const newVal = !state.isDark;
        if (newVal) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
        return { isDark: newVal };
      }),
  };
});
