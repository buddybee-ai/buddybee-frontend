import axios from "axios";

// VITE_API_URL must be set in Vercel → Settings → Environment Variables
// e.g. https://buddybee-backend-production.up.railway.app
// The fallback here is your Railway backend URL — update it if it changes.
const BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://buddybee-backend-production.up.railway.app"
).replace(/\/$/, "");

export const TOKEN_KEY = "token";
export const USER_KEY  = "user";
export const ROLE_KEY  = "role";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,    // 20s — Railway cold starts can take ~10s on hobby plan
  withCredentials: false,
});

// Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize error messages for display
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (backend down / CORS / no internet)
    if (!error.response) {
      error.displayMessage =
        "Cannot reach server. Please check your connection or try again in a moment.";
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
