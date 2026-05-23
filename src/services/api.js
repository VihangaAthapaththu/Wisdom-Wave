import axios from "axios";

/**
 * Configured Axios instance for API calls.
 * - Uses /api prefix (proxied to backend via Vite dev server)
 * - Sends cookies automatically with every request
 */
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response interceptor — handles 401 errors globally.
 * Redirects to sign-in page when token is invalid/expired.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only redirect if not already on auth pages
      const currentPath = window.location.pathname;
      const authPaths = ["/signin", "/signup"];

      if (!authPaths.includes(currentPath)) {
        window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
