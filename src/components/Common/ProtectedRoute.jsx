import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Route guard component.
 * - Shows a loading spinner while auth state is being determined.
 * - Redirects to /signin if not authenticated.
 * - Checks role-based access if `roles` prop is provided.
 *
 * @param {Object} props
 * @param {string[]} [props.roles] - Allowed roles (e.g., ["ADMIN"])
 */
function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();

  // Show spinner while checking authentication
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#0f0f1a",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid rgba(255, 165, 0, 0.3)",
            borderTop: "4px solid #ff9800",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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

export default ProtectedRoute;
