import axios from "axios";

/**
 * Configured Axios instance for API calls.
 * - Uses /api prefix (proxied to backend via Vite dev server)
 * - Sends cookies automatically with every request
 */
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

/**
 * Request interceptor — set Content-Type only when appropriate.
 * - When sending `FormData`, delete Content-Type so the browser sets the boundary.
 * - Otherwise ensure `application/json`.
 */
api.interceptors.request.use(
  (config) => {
    if (config && config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
    } else {
      config.headers = config.headers || {};
      if (!config.headers["Content-Type"] && !config.headers["content-type"]) {
        config.headers["Content-Type"] = "application/json";
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response interceptor — handles 401 errors globally.
 * Redirects to sign-in page when token is invalid/expired.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't perform a global redirect here. Let route guards (e.g. ProtectedRoute)
      // or page-level logic decide when to navigate to the sign-in page. A
      // global redirect breaks public routes like the landing page which call
      // `getMe()` on load and may receive 401 before the router has settled.
      // Optionally, apps can listen for this event: `window.dispatchEvent(new CustomEvent('api:unauthorized', { detail: error }))`
      // and handle it centrally if desired.
    }

    return Promise.reject(error);
  },
);

export default api;