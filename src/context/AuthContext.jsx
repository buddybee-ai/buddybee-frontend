import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function enrichUser(raw) {
  if (!raw) return null;
  const nameParts = (raw.name || "").trim().split(" ");
  return {
    ...raw,
    firstName: nameParts[0] || raw.name,
    initials:  nameParts.map((p) => p[0]).join("").toUpperCase().slice(0, 2) || "U",
    roleLabel: { student: "Student", parent: "Parent", counselor: "Counselor", admin: "Admin" }[raw.role] || raw.role,
  };
}

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [role,    setRole]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Silent session check on load. No token ever touches localStorage or
  // JS-visible state — the browser just sends whatever HttpOnly cookies
  // it already has, and the backend tells us who (if anyone) that is.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.get("/me");
        const enriched = enrichUser(res.data.user);
        setUser(enriched);
        setRole(enriched.role);
      } catch {
        // api.js's response interceptor already tried one silent
        // /auth/refresh + retry before this rejection reaches here — if
        // we're still failing, there's genuinely no valid session (first
        // visit, expired refresh token, or it was revoked/logged out
        // elsewhere). Render as logged out; ProtectedRoute takes it from
        // there. No error surfaced to the user — this is expected for
        // most first-time visitors.
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signup = async (name, email, password, userRole, school_id = null) => {
    try {
      const res = await api.post("/signup", { name, email, password, role: userRole, school_id });
      // Signup now logs the account straight in (cookies are set by the
      // backend response) — mirror that in local state immediately so the
      // very next render already knows who's signed in, same as login().
      if (res.data?.user) {
        const enriched = enrichUser(res.data.user);
        setUser(enriched);
        setRole(enriched.role);
      }
      return { success: true, data: res.data };
    } catch (error) {
      const msg =
        error.response?.data?.detail ||
        error.displayMessage ||
        error.message ||
        "Signup failed";
      return { success: false, message: msg };
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      const res = await api.post("/login", { email, password, remember_me: rememberMe });
      const enriched = enrichUser(res.data.user);
      setUser(enriched);
      setRole(enriched.role);
      return { success: true, data: enriched };
    } catch (error) {
      const msg =
        error.response?.data?.detail ||
        error.displayMessage ||
        error.message ||
        "Login failed";
      return { success: false, message: msg };
    }
  };

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Even if the network call fails, still clear local state below —
      // the user's intent is to be logged out on THIS device regardless.
    }
    setUser(null);
    setRole(null);
  }, []);

  const logoutAllDevices = useCallback(async () => {
    try {
      await api.post("/auth/logout-all");
    } finally {
      setUser(null);
      setRole(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user, role, loading, signup, login, logout, logoutAllDevices,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
