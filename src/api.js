import axios from "axios";

// VITE_API_URL must be set in Vercel → Settings → Environment Variables
// e.g. https://buddybee-backend-production.up.railway.app
// The fallback here is your Railway backend URL — update it if it changes.
const BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://buddybee-backend-production.up.railway.app"
).replace(/\/$/, "");

// ---------------------------------------------------------------------------
// Auth model: HttpOnly cookies + an in-memory CSRF token.
//
// The access/refresh tokens are never readable by JavaScript — no
// localStorage, no sessionStorage. They live in HttpOnly cookies and the
// browser attaches them automatically (`withCredentials: true` below).
//
// The CSRF token works differently, and it's worth being explicit about
// why: the frontend (this app) and the backend API are on two entirely
// different domains. A cookie set by the backend belongs to the backend's
// domain — `document.cookie` on this frontend page can never read it, full
// stop, that's a browser security boundary, not a bug to work around.
// Trying to read it that way was the original (broken) implementation
// here, and it silently killed every POST/PUT/PATCH/DELETE request in the
// app with a 403.
//
// The fix: the backend hands the CSRF value directly in the JSON body of
// /login, /signup, /me, and /auth/refresh — every moment auth state gets
// (re)established. This module keeps that value in a plain JS variable
// (module-scoped, not persisted anywhere) and attaches it as a header on
// every request. The backend still separately receives the *cookie*
// version of the same token automatically (cookies attach based on the
// request's target domain, not the page's origin — that part always
// worked), and compares the two — which is exactly the double-submit
// pattern, just with the frontend's copy sourced from a response body
// instead of an unreadable cross-domain cookie.
// ---------------------------------------------------------------------------

const CSRF_HEADER_NAME = "X-CSRF-Token";
let csrfToken = null;

export function setCsrfToken(token) {
  csrfToken = token || null;
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,    // 20s — Railway cold starts can take ~10s on hobby plan
  withCredentials: true,   // send/receive the HttpOnly auth cookies
});

api.interceptors.request.use(
  (config) => {
    if (csrfToken) config.headers[CSRF_HEADER_NAME] = csrfToken;
    return config;
  },
  (error) => Promise.reject(error)
);

// Silent refresh-and-retry: if a request comes back 401 (access token
// expired — they last ~15 minutes), try exactly one silent /auth/refresh
// and replay the original request. If refresh also fails, the session is
// genuinely over and the caller sees the original 401 — AuthContext is
// what actually clears state and sends the user to /login.
let refreshInFlight = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (!response) {
      error.displayMessage =
        "Cannot reach server. Please check your connection or try again in a moment.";
      return Promise.reject(error);
    }

    const isAuthEndpoint = config?.url?.includes("/auth/refresh") || config?.url === "/login";
    if (response.status === 401 && config && !config._retried && !isAuthEndpoint) {
      config._retried = true;
      try {
        // Coalesce concurrent 401s (e.g. several widgets fetching at once)
        // into a single refresh call instead of a stampede of them.
        refreshInFlight = refreshInFlight || api.post("/auth/refresh");
        const refreshRes = await refreshInFlight;
        refreshInFlight = null;
        // The refresh response carries a brand new CSRF token (the old one
        // was invalidated along with the rotated refresh token) — without
        // updating it here, every request after a silent refresh would
        // start failing CSRF checks again.
        if (refreshRes?.data?.csrf_token) setCsrfToken(refreshRes.data.csrf_token);
        return api(config);
      } catch (refreshError) {
        refreshInFlight = null;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Health check — wakes Railway server on app load to reduce cold-start delay
export const pingBackend = () => api.get("/");


export default api;

// Authentication & account settings
export const requestPasswordReset = (email) => api.post("/forgot-password", { email });
export const resetPassword = (token, password) => api.post("/reset-password", { token, password });
export const getSettings = () => api.get("/settings");
export const updateProfile = (name, email) => api.patch("/settings/profile", { name, email });
export const changePassword = (current_password, new_password) =>
  api.post("/settings/password", { current_password, new_password });

export const updateSettings = (settings) => api.put("/settings", settings);
