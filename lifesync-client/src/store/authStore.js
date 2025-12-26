import { create } from "zustand";
import api from "../services/axios";
import { API_PATHS } from "../services/apiPaths";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  setUser: (user) => {
    set({ user });
  },

  setLoading: (loading) => {
    set({ loading });
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      const res = await api.get(API_PATHS.AUTH.ME);

      set({ user: res.data, loading: false });

    } catch (err) {
     
        set({ user: null, loading: false });
      
    }
  },

  logout: async () => {

    try {
      await api.post(API_PATHS.AUTH.LOGOUT);
    } catch (err) {
      console.log("[AuthStore] logout API failed", err);
    } finally {
      set({ user: null, loading: false });
      console.log("[AuthStore] user cleared");
    }
  },
}));

export default useAuthStore;
