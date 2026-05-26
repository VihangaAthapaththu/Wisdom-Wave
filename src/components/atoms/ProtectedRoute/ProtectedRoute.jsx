import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

/**
 * Route guard component.
 * - Shows a loading spinner while auth state is being determined.
 * - Redirects to /signin if not authenticated.
 * - Checks role-based access if `roles` prop is provided.
 *
 * @param {Object} props
 * @param {string[]} [props.roles] - Allowed roles (e.g., ["ADMIN"])
 */
export function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();

  // Show spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f0f1a]">
        <div className="w-10 h-10 border-4 border-[rgba(255,165,0,0.3)] border-t-[#ff9800] rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Check role-based access
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
