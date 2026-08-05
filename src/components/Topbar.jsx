import { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Bell, Search, Home, Layers } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

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

const NOTIFICATIONS = [
  { id: 1, text: 'Alex Rivera reported high anxiety', time: '2m ago', unread: true, type: 'alert' },
  { id: 2, text: 'New wellness report available', time: '1h ago', unread: true, type: 'report' },
  { id: 3, text: 'Grade 10 engagement dropped 15%', time: '3h ago', unread: false, type: 'analytics' },
  { id: 4, text: 'Counselor check-in scheduled', time: '1d ago', unread: false, type: 'calendar' },
]

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

  const notifRef = useClickOutside(() => setNotifOpen(false))
  const searchRef = useClickOutside(() => setSearchOpen(false))

  const role = user?.role ?? 'admin'
  const badge = ROLE_BADGES[role] ?? ROLE_BADGES.admin
  const avatarGradient = AVATAR_GRADIENT[role] ?? AVATAR_GRADIENT.admin
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length

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
                  <span className="text-sm font-bold text-slate-900">Notifications</span>
                  <span className="text-xs text-primary-600 font-medium cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className={`flex gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer
                        ${n.unread ? 'bg-primary-50/40' : ''}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-primary-500' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 leading-relaxed">{n.text}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 text-center">
                  <span className="text-xs text-primary-600 font-medium cursor-pointer hover:underline">View all notifications</span>
                </div>
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
