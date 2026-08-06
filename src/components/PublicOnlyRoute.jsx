import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Where an already-authenticated visitor lands when they hit "/", "/login",
// or "/signup" — students go straight into the chat companion (the
// ChatGPT-style "open the site, you're just in the app" experience);
// every other role lands on their own dashboard home.
const ROLE_HOME = {
  student:   "/dashboard/chat",
  parent:    "/dashboard/parent",
  counselor: "/dashboard/counselor",
  admin:     "/dashboard/admin",
};

/**
 * PublicOnlyRoute — the inverse of ProtectedRoute. Wraps routes that only
 * make sense for a signed-out visitor (landing page, login, signup); an
 * already-authenticated user is redirected straight into their dashboard
 * instead of seeing the marketing page or a login form for an account
 * they're already in.
 */
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, role, loading } = useAuth();

  // Same silent-check window as ProtectedRoute — never flash the landing
  // page or login form while we're still finding out who (if anyone)
  // this is.
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

  if (isAuthenticated) {
    return <Navigate to={ROLE_HOME[role] || "/dashboard"} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
