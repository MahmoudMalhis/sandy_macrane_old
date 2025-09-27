// client/src/api/useAuthStore.js - مُصحح
import { create } from "zustand";
import { authAPI } from "./auth";

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: localStorage.getItem("authToken"),
  isAuthenticated: !!localStorage.getItem("authToken"),
  loading: false,

  // Actions
  login: async (credentials) => {
    set({ loading: true });
    try {
      const response = await authAPI.login(credentials);

      // تعديل للتعامل مع structure الصحيح للـ response
      const { data } = response;
      const { user, token } = data;

      localStorage.setItem("authToken", token);
      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      set({ loading: false });
      return {
        success: false,
        error: error.message || "فشل في تسجيل الدخول",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await authAPI.getProfile();
      const user = response.data; // تعديل للتعامل مع structure الصحيح
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error("Check auth failed:", error);
      get().logout();
    }
  },
}));

export default useAuthStore;
