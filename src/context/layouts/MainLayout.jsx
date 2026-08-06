import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ErrorBoundary from '../../components/ErrorBoundary'

// NOTE: this used to wrap <Outlet/> in AnimatePresence + a fade/slide
// PageTransition for a nicer page-switch feel — the exact same pattern
// that caused the dashboard chat page to render completely invisible
// (content present in the DOM, permanently stuck at its `initial`
// opacity of 0, because the animation coordinating it never resolved).
// That fix removed it from DashboardLayout; this page was still showing
// the identical symptom on marketing pages (Features confirmed blank via
// screenshot), so the same animation wrapper is removed here too rather
// than keep guessing at a fix for a mechanism already proven unreliable.
// Content visibility isn't optional — a missing fade-in is.
export default function MainLayout() {
  const location = useLocation()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Keyed by route so a caught error on one page doesn't linger
            when the visitor navigates to a different, working page. */}
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}

