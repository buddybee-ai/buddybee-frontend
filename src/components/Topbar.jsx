import { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Bell, Search, Home, Layers, AlertTriangle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const ROLE_BADGES = {
  student:   { label: 'Student',    bg: 'bg-blue-50',   text: 'text-blue-700'   },
  parent:    { label: 'Parent',     bg: 'bg-emerald-50', text: 'text-emerald-700' },
  counselor: { label: 'Counselor',  bg: 'bg-purple-50', text: 'text-purple-700'  },
  admin:     { label: 'Super Admin',bg: 'bg-primary-50', text: 'text-primary-700'  },
}

const AVATAR_GRADIENT = {
  student: 'from-blue-500 to-blue-600',
  parent: 'from-emerald-500 to-emerald-600',
  counselor: 'from-purple-500 to-purple-600',
  admin: 'from-primary-600 to-primary-700',
}

// Turns an ISO/SQL timestamp string into a short "Xm ago" label. Falls
// back to the raw string if parsing fails rather than throwing.
function timeAgo(isoString) {
  if (!isoString) return ''
  const then = new Date(isoString.replace(' ', 'T') + (isoString.includes('Z') ? '' : 'Z'))
  if (isNaN(then.getTime())) return ''
  const diffMs = Date.now() - then.getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function useClickOutside(onOutside) {
  const ref = useRef(null)
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onOutside() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onOutside])
  return ref
}

export default function Topbar({ onMenuOpen }) {
  const { user } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [acking, setAcking] = useState(null)

  const notifRef = useClickOutside(() => setNotifOpen(false))
  const searchRef = useClickOutside(() => setSearchOpen(false))

  const role = user?.role ?? 'admin'
  const badge = ROLE_BADGES[role] ?? ROLE_BADGES.admin
  const avatarGradient = AVATAR_GRADIENT[role] ?? AVATAR_GRADIENT.admin

  // Real active red-flag alerts, counselor-only — replaces what used to
  // be a hardcoded fake notification array shown identically to every
  // role. Polling (not WebSockets) matches the rest of the app's
  // architecture and is more than sufficient at this scale: a handful of
  // counselor sessions polling every 20s is a trivial request volume.
  useEffect(() => {
    if (role !== 'counselor') return
    let cancelled = false
    const poll = () => {
      api.get('/api/counselor/alerts')
        .then(res => { if (!cancelled) setAlerts(res.data.alerts || []) })
        .catch(() => {})
    }
    poll()
    const interval = setInterval(poll, 20000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [role])

  const acknowledge = (alertId) => {
    setAcking(alertId)
    api.post(`/api/counselor/alerts/${alertId}/acknowledge`)
      .then(() => setAlerts(prev => prev.filter(a => a.id !== alertId)))
      .catch(() => {})
      .finally(() => setAcking(null))
  }

  const unreadCount = alerts.length

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sm:px-5 flex-shrink-0 z-10 relative">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-slate-900 text-sm hidden sm:inline">Dashboard</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
            <span className="text-xs font-semibold text-emerald-700">LIVE</span>
          </div>
          <span className={`hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
        </div>
      </div>

      {/* Right: search, links, notif, profile */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <div className="relative" ref={searchRef}>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Search size={17} />
          </button>
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50"
              >
                <input
                  autoFocus
                  placeholder="Search students, reports..."
                  className="w-full text-sm outline-none text-slate-900 placeholder-slate-400"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav links — desktop only */}
        <div className="hidden lg:flex items-center gap-1">
          {[['/', 'Home', Home], ['/features', 'Features', Layers]].map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl transition-colors
                ${isActive ? 'text-primary-600 bg-primary-50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`
              }
            >
              <Icon size={13} />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label={role === 'counselor' ? 'Active red-flag alerts' : 'Notifications'}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
              >
                {unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    {role === 'counselor' ? 'Active Alerts' : 'Notifications'}
                  </span>
                </div>

                {role !== 'counselor' ? (
                  <div className="px-4 py-8 text-center text-xs text-slate-400">No notifications</div>
                ) : alerts.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <div className="text-2xl mb-1">✅</div>
                    <p className="text-xs text-slate-400">No active alerts right now</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {alerts.map((a) => (
                      <div
                        key={a.id}
                        className="flex gap-3 px-4 py-3 border-b border-slate-50 bg-rose-50/60"
                      >
                        <AlertTriangle size={14} className="text-rose-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800">
                            {a.student_name || 'A student'} — {a.risk_level} risk
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {timeAgo(a.created_at)}
                            {a.trigger_count > 1 ? ` · triggered ${a.trigger_count}×` : ''}
                            {a.reminder_count > 0 ? ` · reminded ${a.reminder_count}×` : ''}
                          </p>
                          <button
                            onClick={() => acknowledge(a.id)}
                            disabled={acking === a.id}
                            className="mt-1.5 text-xs font-medium text-primary-600 hover:underline disabled:opacity-50"
                          >
                            {acking === a.id ? 'Acknowledging…' : 'Acknowledge'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2.5 border-l border-slate-100 ml-1">
          <div
            className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-xs font-bold cursor-pointer shadow-sm`}
          >
            {user?.initials ?? 'U'}
          </div>
          {user && (
            <div className="hidden md:block">
              <div className="text-xs font-semibold text-slate-900 leading-none">{user.firstName}</div>
              <div className="text-xs text-slate-400 mt-0.5">{user.roleLabel}</div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
