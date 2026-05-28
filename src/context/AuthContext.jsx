import React, { useState, useEffect } from 'react';
import { useGetMe, useLogin, useRegister, useLogout } from '@/hooks';
import { AuthContext } from './authContextValue';

/**
 * Provides authentication state and actions to the entire app.
 * Uses React Query hooks for server interactions.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getMeQuery = useGetMe({ enabled: true });
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  // Sync query result into local state
  useEffect(() => {
    const data = getMeQuery.data;
    if (data) {
      const u = data?.data?.user || data?.user || data;
      setUser(u || null);
    } else {
      setUser(null);
    }
    setLoading(getMeQuery.isFetching || getMeQuery.isLoading);
  }, [getMeQuery.data, getMeQuery.isFetching, getMeQuery.isLoading]);

  const checkAuth = async () => {
    setLoading(true);
    try {
      const res = await getMeQuery.refetch();
      const u = res?.data?.data?.user || res?.data?.user || res?.data || null;
      setUser(u);
      return u;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const resp = await loginMutation.mutateAsync({ email, password });
    const u = resp?.data?.user || resp?.user || resp;
    setUser(u || null);
    return u;
  };

  const register = async (data) => {
    const resp = await registerMutation.mutateAsync(data);
    const u = resp?.data?.user || resp?.user || resp;
    setUser(u || null);
    return u;
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
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
