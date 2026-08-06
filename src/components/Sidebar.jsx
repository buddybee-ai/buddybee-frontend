import { NavLink, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, MessageSquare, FileText, Settings,
  Bell, Plus, ChevronLeft, LogOut, Users, BarChart2,
  AlertTriangle, School, UserCog, HeartPulse, Zap
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { useLang, LANGUAGES } from '../context/LanguageContext'
import { getT } from '../translations'

// ── Nav config ──────────────────────────────────────────────────────────────
// NOTE: this app has one all-in-one dashboard route per role (with internal
// tabs for sub-sections), not a separate URL per section. Every link below
// must point to a route that actually exists in App.jsx — a few of these
// used to point at paths with no matching <Route>, which silently bounced
// the user back to the homepage via the catch-all route. Fixed by pointing
// each secondary item at its real parent dashboard.
const NAV_CONFIG = {
  student: [
    { to: '/dashboard/student',   icon: LayoutDashboard, labelKey: 'nav.dashboard', end: true },
    { to: '/dashboard/chat',      icon: MessageSquare,   labelKey: 'nav.aiChat'    },
    { to: '/dashboard/student',   icon: HeartPulse,      labelKey: 'nav.wellness'  },
    { to: '/dashboard/student',   icon: Zap,             labelKey: 'nav.activity'  },
    { to: '/dashboard/settings',  icon: Settings,        labelKey: 'nav.settings'  },
  ],
  // Parent dashboard disabled for public release — re-enable when launched
  parent: [],
  counselor: [
    { to: '/dashboard/counselor', icon: LayoutDashboard, labelKey: 'nav.dashboard', end: true },
    { to: '/dashboard/counselor', icon: Users,           labelKey: 'nav.students'  },
    { to: '/dashboard/counselor', icon: BarChart2,       labelKey: 'nav.analytics' },
    { to: '/dashboard/counselor', icon: AlertTriangle,   labelKey: 'nav.alerts'    },
    { to: '/dashboard/chat',      icon: MessageSquare,   labelKey: 'nav.chat'      },
    { to: '/dashboard/settings',  icon: Settings,        labelKey: 'nav.settings'  },
  ],
  admin: [
    { to: '/dashboard/admin',     icon: LayoutDashboard, labelKey: 'nav.dashboard', end: true },
    { to: '/dashboard/admin',     icon: UserCog,         labelKey: 'nav.users'     },
    { to: '/dashboard/admin',     icon: School,          labelKey: 'nav.schools'   },
    { to: '/dashboard/admin',     icon: BarChart2,       labelKey: 'nav.analytics' },
    { to: '/dashboard/admin',     icon: AlertTriangle,   labelKey: 'nav.alerts'    },
    { to: '/dashboard/settings',  icon: Settings,        labelKey: 'nav.settings'  },
  ],
}

const ROLE_META = {
  student:  { titleKey: 'portal.student',   subKey: 'portal.student_sub'   },
  parent:   { titleKey: 'portal.parent',    subKey: 'portal.parent_sub'    },
  counselor:{ titleKey: 'portal.counselor', subKey: 'portal.counselor_sub' },
  admin:    { titleKey: 'portal.admin',     subKey: 'portal.admin_sub'     },
}

const AVATAR_GRADIENT = {
  student: 'from-blue-500 to-blue-600',
  parent: 'from-emerald-500 to-emerald-600',
  counselor: 'from-purple-500 to-purple-600',
  admin: 'from-primary-600 to-primary-700',
}

export default function Sidebar({ collapsed, onCollapse, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth()
  const { lang, setLang, LANGUAGES: langs } = useLang()
  const T = getT(lang)
  const navigate = useNavigate()

  const role = user?.role || 'student'
  const navLinks = NAV_CONFIG[role]
  const meta = ROLE_META[role]
  const avatarGradient = AVATAR_GRADIENT[role]

  const handleLogout = async () => { await logout(); navigate('/login') }

  const isUrdu = lang === 'ur'
  const urduFont = isUrdu ? "'Noto Nastaliq Urdu', serif" : 'inherit'

  return (
    <>
      {isUrdu && (
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;600&display=swap');`}</style>
      )}

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 md:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: collapsed ? 68 : 248 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed md:relative z-30 h-full bg-white/90 backdrop-blur-md border-r border-slate-100 flex flex-col overflow-hidden transition-transform duration-300 ease-out-expo
          ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-100 flex-shrink-0">
          {!collapsed ? (
            <Link to="/" className="flex items-center gap-2.5 min-w-0">
              <span className="text-2xl flex-shrink-0">🐝</span>
              <div className="min-w-0">
                <div className="text-sm font-bold font-display truncate" style={{ fontFamily: urduFont }}>
                  {T(meta.titleKey)}
                </div>
                <div className="text-xs text-slate-400 truncate" style={{ fontFamily: urduFont }}>
                  {T(meta.subKey)}
                </div>
              </div>
            </Link>
          ) : (
            <span className="text-2xl mx-auto">🐝</span>
          )}
        </div>

        {/* New Chat */}
        <div className="p-3 flex-shrink-0">
          <Link
            to="/dashboard/chat"
            className={`group relative flex items-center gap-2 overflow-hidden bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-xl px-3 py-2.5 shadow-primary transition-all duration-300 hover:shadow-glow-lg hover:-translate-y-0.5 active:scale-[0.98] ${collapsed ? 'justify-center' : ''}`}
          >
            <Plus size={16} className="relative z-10 transition-transform duration-300 group-hover:rotate-90" />
            {!collapsed && (
              <span className="relative z-10" style={{ fontFamily: urduFont, fontSize: isUrdu ? '13px' : '14px' }}>
                {T('nav.newChat')}
              </span>
            )}
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2.5 space-y-0.5 overflow-y-auto">
          {(() => {
            // Several items intentionally share a destination (no dedicated
            // route/tab exists yet for each sub-section — see NAV_CONFIG
            // comment above). Only the FIRST item per unique `to` gets the
            // animated active-pill / shares the layoutId; duplicates still
            // navigate correctly, they just don't fight over the same
            // shared layout animation (which both React and Framer Motion
            // correctly warn about when multiple elements claim the same
            // key/layoutId at once).
            const seenPaths = new Set()
            return navLinks.map(({ to, icon: Icon, labelKey, end }) => {
              const isPrimaryForPath = !seenPaths.has(to)
              seenPaths.add(to)
              return (
                <NavLink
                  key={labelKey} to={to} end={end}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200
                    ${isActive && isPrimaryForPath ? 'text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                    ${collapsed ? 'justify-center' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && isPrimaryForPath && (
                        <motion.span
                          layoutId="sidebar-active"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                          className="absolute inset-0 bg-primary-50 rounded-xl -z-10"
                        />
                      )}
                      <Icon size={18} className="flex-shrink-0" />
                      {!collapsed && (
                        <span style={{ fontFamily: urduFont, fontSize: isUrdu ? '13px' : '14px', lineHeight: isUrdu ? 2 : 1.4 }}>
                          {T(labelKey)}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              )
            })
          })()}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-slate-100 space-y-2 flex-shrink-0">

          {/* Language switcher — only when expanded */}
          {!collapsed && (
            <div className="flex gap-1 bg-slate-50 rounded-xl p-1">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  title={l.label}
                  className="relative flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200"
                  style={{ color: lang === l.code ? '#4040d0' : '#78716c' }}
                >
                  {lang === l.code && (
                    <motion.span
                      layoutId="lang-pill"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      className="absolute inset-0 bg-white rounded-lg shadow-soft -z-10"
                    />
                  )}
                  {l.flag} {l.code === 'roman' ? 'RM' : l.native}
                </button>
              ))}
            </div>
          )}

          {/* User info */}
          {!collapsed && user && (
            <div className="flex items-center gap-2.5 px-1">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradient} text-white flex items-center justify-center text-xs font-bold shadow-sm flex-shrink-0`}>
                {user.initials}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate">{user.name}</div>
                <div className="text-xs text-slate-400 truncate" style={{ fontFamily: urduFont }}>
                  {user.roleLabel}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onCollapse}
            className="hidden md:flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-slate-50 rounded-xl text-slate-500 transition-colors"
          >
            <ChevronLeft size={14} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
            {!collapsed && (
              <span style={{ fontFamily: urduFont }}>{T('nav.collapse')}</span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-red-50 hover:text-red-600 rounded-xl text-slate-500 transition-colors ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={14} />
            {!collapsed && (
              <span style={{ fontFamily: urduFont }}>{T('common.logout')}</span>
            )}
          </button>

        </div>
      </motion.aside>
    </>
  )
}
