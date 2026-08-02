import React, { createContext, useContext, useState, useEffect } from "react";
import api, { TOKEN_KEY, USER_KEY, ROLE_KEY } from "../api";

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
  const [token,   setToken]   = useState(null);
  const [role,    setRole]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken   = localStorage.getItem(TOKEN_KEY);
      const storedUserRaw = localStorage.getItem(USER_KEY);

      if (!storedToken) {
        setLoading(false);
        return;
      }

      // Immediately restore from localStorage so user sees dashboard right away
      if (storedUserRaw) {
        try {
          const cached = JSON.parse(storedUserRaw);
          setToken(storedToken);
          setUser(cached);
          setRole(cached.role);
        } catch { /* corrupt data — /me will fix */ }
      }

      // Silently validate token in background
      try {
        const res = await api.get("/me");
        const enriched = enrichUser(res.data.user);
        localStorage.setItem(USER_KEY, JSON.stringify(enriched));
        localStorage.setItem(ROLE_KEY, enriched.role);
        setToken(storedToken);
        setUser(enriched);
        setRole(enriched.role);
      } catch (err) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          // Token rejected by server — force re-login
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          localStorage.removeItem(ROLE_KEY);
          setToken(null);
          setUser(null);
          setRole(null);
        }
        // Any other error (network, timeout, CORS, cold start) → stay logged in
        // so a Railway cold-start doesn't log the user out
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signup = async (name, email, password, userRole, school_id = null) => {
    try {
      const res = await api.post("/signup", { name, email, password, role: userRole, school_id });
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

  const login = async (email, password) => {
    try {
      const res = await api.post("/login", { email, password });
      const { token: newToken, user: rawUser } = res.data;
      const enriched = enrichUser(rawUser);

      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY,  JSON.stringify(enriched));
      localStorage.setItem(ROLE_KEY,  enriched.role);

      setToken(newToken);
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

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
    setToken(null);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loading, signup, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
