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
const NAV_CONFIG = {
  student: [
    { to: '/dashboard',           icon: LayoutDashboard, labelKey: 'nav.dashboard', end: true },
    { to: '/dashboard/chat',      icon: MessageSquare,   labelKey: 'nav.aiChat'    },
    { to: '/dashboard/wellness',  icon: HeartPulse,      labelKey: 'nav.wellness'  },
    { to: '/dashboard/activity',  icon: Zap,             labelKey: 'nav.activity'  },
    { to: '/dashboard/settings',  icon: Settings,        labelKey: 'nav.settings'  },
  ],
  parent: [
    { to: '/dashboard',          icon: LayoutDashboard, labelKey: 'nav.dashboard', end: true },
    { to: '/dashboard/reports',  icon: FileText,        labelKey: 'nav.reports'   },
    { to: '/dashboard/alerts',   icon: Bell,            labelKey: 'nav.alerts'    },
    { to: '/dashboard/settings', icon: Settings,        labelKey: 'nav.settings'  },
  ],
  counselor: [
    { to: '/dashboard',           icon: LayoutDashboard, labelKey: 'nav.dashboard', end: true },
    { to: '/dashboard/students',  icon: Users,           labelKey: 'nav.students'  },
    { to: '/dashboard/analytics', icon: BarChart2,       labelKey: 'nav.analytics' },
    { to: '/dashboard/alerts',    icon: AlertTriangle,   labelKey: 'nav.alerts'    },
    { to: '/dashboard/chat',      icon: MessageSquare,   labelKey: 'nav.chat'      },
    { to: '/dashboard/settings',  icon: Settings,        labelKey: 'nav.settings'  },
  ],
  admin: [
    { to: '/dashboard',           icon: LayoutDashboard, labelKey: 'nav.dashboard', end: true },
    { to: '/dashboard/users',     icon: UserCog,         labelKey: 'nav.users'     },
    { to: '/dashboard/schools',   icon: School,          labelKey: 'nav.schools'   },
    { to: '/dashboard/analytics', icon: BarChart2,       labelKey: 'nav.analytics' },
    { to: '/dashboard/alerts',    icon: AlertTriangle,   labelKey: 'nav.alerts'    },
    { to: '/dashboard/settings',  icon: Settings,        labelKey: 'nav.settings'  },
  ],
}

const ROLE_META = {
  student:  { titleKey: 'portal.student',   subKey: 'portal.student_sub'   },
  parent:   { titleKey: 'portal.parent',    subKey: 'portal.parent_sub'    },
  counselor:{ titleKey: 'portal.counselor', subKey: 'portal.counselor_sub' },
  admin:    { titleKey: 'portal.admin',     subKey: 'portal.admin_sub'     },
}

const AVATAR_COLORS = {
  student: 'bg-blue-500', parent: 'bg-emerald-500',
  counselor: 'bg-purple-500', admin: 'bg-indigo-600',
}

export default function Sidebar({ collapsed, onCollapse, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth()
  const { lang, setLang, LANGUAGES: langs } = useLang()
  const T = getT(lang)
  const navigate = useNavigate()

  const role = user?.role || 'student'
  const navLinks = NAV_CONFIG[role]
  const meta = ROLE_META[role]
  const avatarBg = AVATAR_COLORS[role]

  const handleLogout = () => { logout(); navigate('/login') }

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
            className="fixed inset-0 bg-black/30 z-20 md:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.25 }}
        className={`fixed md:relative z-30 h-full bg-white border-r border-slate-100 flex flex-col shadow-sm overflow-hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b">
          {!collapsed ? (
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🐝</span>
              <div>
                <div className="text-sm font-bold" style={{ fontFamily: urduFont }}>
                  {T(meta.titleKey)}
                </div>
                <div className="text-xs text-slate-400" style={{ fontFamily: urduFont }}>
                  {T(meta.subKey)}
                </div>
              </div>
            </Link>
          ) : (
            <span className="text-2xl mx-auto">🐝</span>
          )}
        </div>

        {/* New Chat */}
        <div className="p-3">
          <Link
            to="/dashboard/chat"
            className={`flex items-center gap-2 bg-indigo-600 text-white rounded-xl px-3 py-2 hover:bg-indigo-700 ${collapsed ? 'justify-center' : ''}`}
          >
            <Plus size={16} />
            {!collapsed && (
              <span style={{ fontFamily: urduFont, fontSize: isUrdu ? '13px' : '14px' }}>
                {T('nav.newChat')}
              </span>
            )}
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          {navLinks.map(({ to, icon: Icon, labelKey, end }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition
                ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}
                ${collapsed ? 'justify-center' : ''}`
              }
            >
              <Icon size={18} />
              {!collapsed && (
                <span style={{ fontFamily: urduFont, fontSize: isUrdu ? '13px' : '14px', lineHeight: isUrdu ? 2 : 1.4 }}>
                  {T(labelKey)}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t space-y-2">

          {/* Language switcher — only when expanded */}
          {!collapsed && (
            <div className="flex gap-1 bg-slate-50 rounded-xl p-1">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  title={l.label}
                  className="flex-1 py-1 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: lang === l.code ? 'white' : 'transparent',
                    color: lang === l.code ? '#b45309' : '#78716c',
                    boxShadow: lang === l.code ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  {l.flag} {l.code === 'roman' ? 'RM' : l.native}
                </button>
              ))}
            </div>
          )}

          {/* User info */}
          {!collapsed && user && (
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${avatarBg} text-white flex items-center justify-center text-xs font-bold`}>
                {user.initials}
              </div>
              <div>
                <div className="text-xs font-semibold">{user.name}</div>
                <div className="text-xs text-slate-400" style={{ fontFamily: urduFont }}>
                  {user.roleLabel}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onCollapse}
            className="hidden md:flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-slate-50 rounded-xl text-slate-500"
          >
            <ChevronLeft size={14} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            {!collapsed && (
              <span style={{ fontFamily: urduFont }}>{T('nav.collapse')}</span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-red-50 hover:text-red-600 rounded-xl text-slate-500"
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
