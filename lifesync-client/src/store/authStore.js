import { create } from "zustand";
import api from "../services/axios";
import { API_PATHS } from "../services/apiPaths";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  setUser: (user) => {
    console.log("[AuthStore] setUser:", user);
    set({ user });
  },

  setLoading: (loading) => {
    console.log("[AuthStore] setLoading:", loading);
    set({ loading });
  },

  checkAuth: async () => {
    console.log("[AuthStore] checkAuth() called");

    try {
      console.log("[AuthStore] Calling /auth/me");
      const res = await api.get(API_PATHS.AUTH.ME);

      console.log("[AuthStore] /auth/me success:", res.data);
      set({ user: res.data, loading: false });

    } catch (err) {
      console.log(
        "[AuthStore] /auth/me failed:",
        err.response?.status,
        err.response?.data
      );

      if (err.response?.status === 401) {
        console.log("[AuthStore] Setting user = null (unauthenticated)");
        set({ user: null, loading: false });
      }
    }
  },

  logout: async () => {
    console.log("[AuthStore] logout() called");

    try {
      await api.post(API_PATHS.AUTH.LOGOUT);
      console.log("[AuthStore] logout API success");
    } catch (err) {
      console.log("[AuthStore] logout API failed", err);
    } finally {
      set({ user: null, loading: false });
      console.log("[AuthStore] user cleared");
    }
  },
}));

export default useAuthStore;
