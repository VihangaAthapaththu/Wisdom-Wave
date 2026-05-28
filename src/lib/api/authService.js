import api from "./api";

/**
 * Frontend auth service — wraps API calls to auth endpoints.
 */
export const authService = {
  /**
   * Login with email and password.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} User data
   */
  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  /**
   * Register a new user.
   * @param {Object} data - { name, email, password, confirmPassword }
   * @returns {Promise<Object>} User data
   */
  async register(data) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  /**
   * Logout the current user (clears httpOnly cookie server-side).
   * @returns {Promise<Object>}
   */
  async logout() {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  /**
   * Get the current authenticated user's profile.
   * @returns {Promise<Object>} User data
   */
  async getMe() {
    const response = await api.get("/auth/me");
    return response.data;
  },
};


