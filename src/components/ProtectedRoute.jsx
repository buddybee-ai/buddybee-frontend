import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_ROUTES = {
  student:   "/dashboard/student",
  parent:    "/dashboard/parent",
  counselor: "/dashboard/counselor",
  admin:     "/dashboard/admin",
};

const ProtectedRoute = ({ children, roleRequired }) => {
  const { isAuthenticated, role, loading } = useAuth();

  // Still checking the HttpOnly-cookie session — render nothing to
  // prevent a flash of the login page before we actually know.
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce-soft">🐝</div>
          <p className="text-slate-400 text-sm">Loading BuddyBee...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but wrong role → redirect to correct dashboard
  if (roleRequired && role !== roleRequired) {
    const destination = ROLE_ROUTES[role] || "/login";
    return <Navigate to={destination} replace />;
  }

  return children;
};

export default ProtectedRoute;
