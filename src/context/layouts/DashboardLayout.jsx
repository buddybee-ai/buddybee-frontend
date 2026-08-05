import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Topbar  from '../../components/Topbar'
import ErrorBoundary from '../../components/ErrorBoundary'

// Auth is handled by ProtectedRoute in App.jsx — this is purely the visual shell.
//
// NOTE: this used to wrap <Outlet/> in AnimatePresence + a fade/slide
// PageTransition for a nicer page-switch feel. Removed on purpose: that
// combination (AnimatePresence mode="wait" + React 18 StrictMode's
// intentional double-invoking of renders in dev) has a known failure mode
// where the "enter" animation never fires — content mounts, sits at its
// `initial` opacity (0) forever, and is invisible while still fully
// present and selectable in the DOM. That exact symptom is what was being
// reported here. Content visibility matters more than a fade transition,
// so the dashboard now renders instantly with no animation to get stuck.
export default function DashboardLayout() {
  const [collapsed,  setCollapsed]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar onMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4">
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
