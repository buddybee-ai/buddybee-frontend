import axios from "axios";

// VITE_API_URL must be set in Vercel → Settings → Environment Variables
// e.g. https://buddybee-backend-production.up.railway.app
// The fallback here is your Railway backend URL — update it if it changes.
const BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://buddybee-backend-production.up.railway.app"
).replace(/\/$/, "");

// ---------------------------------------------------------------------------
// Auth model: HttpOnly cookies only.
//
// There is deliberately no token stored anywhere JavaScript can read it —
// no localStorage, no sessionStorage, no in-memory copy of the JWT. The
// browser attaches the access/refresh cookies automatically on every
// request to the API origin (`withCredentials: true` below is what makes
// axios include them), and the backend is the only thing that ever reads
// their contents. The one cookie the frontend DOES read is `csrf_token` —
// that one is intentionally NOT HttpOnly; echoing it back as a header on
// state-changing requests is the whole point of the double-submit pattern
// (see api.py's `_verify_csrf`).
// ---------------------------------------------------------------------------

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "X-CSRF-Token";

function readCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,    // 20s — Railway cold starts can take ~10s on hobby plan
  withCredentials: true,   // send/receive the HttpOnly auth cookies
});

// Attach the CSRF header on every request; harmless on GETs (the backend
// only checks it for state-changing methods), and means we never have to
// remember to add it per-call.
api.interceptors.request.use(
  (config) => {
    const csrf = readCookie(CSRF_COOKIE_NAME);
    if (csrf) config.headers[CSRF_HEADER_NAME] = csrf;
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
        await refreshInFlight;
        refreshInFlight = null;
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
