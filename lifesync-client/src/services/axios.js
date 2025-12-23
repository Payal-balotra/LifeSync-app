import axios from "axios";
import { API_PATHS } from "./apiPaths";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❌ No response → network error
    if (!error.response) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response.status === 401;

    // 🔥 IMPORTANT: detect refresh endpoint
    const isRefreshCall =
      originalRequest.url === API_PATHS.AUTH.REFRESH_TOKEN;

    // ❌ If refresh token itself failed → logout (NO retry)
    if (isUnauthorized && isRefreshCall) {
      window.location.href = "/";
      return Promise.reject(error);
    }

    // 🔁 Try refreshing access token ONLY ONCE
    if (isUnauthorized && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // ⚠️ Use SAME axios instance OR plain axios with full URL
        await api.post(API_PATHS.AUTH.REFRESH_TOKEN);

        // 🔁 Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
