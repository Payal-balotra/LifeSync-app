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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = originalRequest.url;

    /* ----------------------------------------------------
       1️⃣ Ignore AUTH routes (VERY IMPORTANT)
       ---------------------------------------------------- */
    const isAuthRoute =
      url.includes(API_PATHS.AUTH.LOGIN) ||
      url.includes(API_PATHS.AUTH.SIGNUP) ||
      url.includes(API_PATHS.AUTH.FORGOT_PASSWORD) ||
      url.includes(API_PATHS.AUTH.RESET_PASSWORD);

    if (status === 401 && isAuthRoute) {
      //  DO NOT redirect
      return Promise.reject(error);
    }

    /* ----------------------------------------------------
       2️⃣ Refresh token call failed → logout
       ---------------------------------------------------- */
    const isRefreshCall = url.includes(API_PATHS.AUTH.REFRESH_TOKEN);

    if (status === 401 && isRefreshCall) {
      window.location.href = "/"; // your login route
      return Promise.reject(error);
    }

    /* ----------------------------------------------------
       3️⃣ Normal protected API → try refresh ONCE
       ---------------------------------------------------- */
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        await api.post(API_PATHS.AUTH.REFRESH_TOKEN);
        processQueue();
        return api(originalRequest);
      } catch (err) {
        processQueue(err);
        window.location.href = "/";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
