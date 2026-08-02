import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { pingBackend } from "./api.js";

import "./index.css";

// Wake Railway backend immediately on app load
// so it's ready before the user clicks Sign In
pingBackend();

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
