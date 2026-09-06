import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import GlobalBackground from "./components/ui/GlobalBackground.jsx";
import { pingBackend } from "./api.js";

import "./index.css";
// KaTeX's own stylesheet for rendered math (fonts, spacing, fraction
// bars, etc). Imported once globally, same pattern as index.css above.
import "katex/dist/katex.min.css";

// Wake Railway backend immediately on app load
// so it's ready before the user clicks Sign In
pingBackend();

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter
        future={{
          // Opts into React Router v7's upcoming behavior early, which is
          // exactly what those two console warnings were asking for — this
          // silences them cleanly instead of ignoring them, and means
          // upgrading to v7 later won't require any routing changes.
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <LanguageProvider>
          <ToastProvider>
            <AuthProvider>
              {/* Mounted once, outside every Route — persists across all
                  navigation so the whole app shares one continuous
                  background instead of it resetting per page. */}
              <GlobalBackground />
              <App />
            </AuthProvider>
          </ToastProvider>
        </LanguageProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
