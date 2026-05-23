import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

/**
 * Provides authentication state and actions to the entire app.
 * On mount, checks for an existing session via the httpOnly cookie.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Verify if a valid session exists (httpOnly cookie is sent automatically).
   */
  const checkAuth = async () => {
    try {
      const response = await authService.getMe();
      setUser(response.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with email and password.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} User object
   */
  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setUser(response.data.user);
    return response.data.user;
  };

  /**
   * Register a new account.
   * @param {Object} data - { name, email, password, confirmPassword }
   * @returns {Promise<Object>} User object
   */
  const register = async (data) => {
    const response = await authService.register(data);
    setUser(response.data.user);
    return response.data.user;
  };

  /**
   * Logout — clears server-side cookie and local state.
   */
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context.
 * Must be used within an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
