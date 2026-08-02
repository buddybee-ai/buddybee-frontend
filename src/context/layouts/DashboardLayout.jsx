import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Topbar  from '../../components/Topbar'

// Auth is handled by ProtectedRoute in App.jsx — this is purely the visual shell.
export default function DashboardLayout() {
  const [collapsed,  setCollapsed]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar onMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-2">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
