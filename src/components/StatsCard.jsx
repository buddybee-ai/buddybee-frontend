import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

/**
 * StatsCard — universal animated metric card
 * Props: title, value, subtitle, icon, trend ('up'|'down'|'neutral'), trendValue,
 *        color ('blue'|'green'|'red'|'purple'|'orange'|'indigo'), delay
 */

const COLOR_MAP = {
  blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-500',   text: 'text-blue-600',   ring: 'ring-blue-100'   },
  green:  { bg: 'bg-emerald-50',icon: 'bg-emerald-500',text: 'text-emerald-600',ring: 'ring-emerald-100' },
  red:    { bg: 'bg-red-50',    icon: 'bg-red-500',    text: 'text-red-600',    ring: 'ring-red-100'    },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-500', text: 'text-purple-600', ring: 'ring-purple-100' },
  orange: { bg: 'bg-orange-50', icon: 'bg-orange-500', text: 'text-orange-600', ring: 'ring-orange-100' },
  indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-500', text: 'text-indigo-600', ring: 'ring-indigo-100' },
  yellow: { bg: 'bg-yellow-50', icon: 'bg-yellow-500', text: 'text-yellow-600', ring: 'ring-yellow-100' },
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = 'neutral',
  trendValue,
  color = 'blue',
  delay = 0,
  onClick,
}) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.blue

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'text-emerald-600 bg-emerald-50' : trend === 'down' ? 'text-red-600 bg-red-50' : 'text-slate-500 bg-slate-100'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(92,92,232,0.12)' }}
      onClick={onClick}
      className={`relative bg-white rounded-2xl p-5 border border-slate-100 shadow-sm cursor-default
        ${onClick ? 'cursor-pointer' : ''} overflow-hidden`}
    >
      {/* Background accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${c.bg} rounded-full -translate-y-8 translate-x-8 opacity-60`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 ${c.icon} rounded-xl flex items-center justify-center shadow-sm`}>
            {Icon && <Icon size={18} className="text-white" />}
          </div>
          {trendValue && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trendColor}`}>
              <TrendIcon size={11} />
              {trendValue}
            </div>
          )}
        </div>

        <div className="font-display text-2xl font-bold text-slate-900 mb-0.5 leading-none">
          {value}
        </div>
        <div className="text-xs font-semibold text-slate-600 mb-1">{title}</div>
        {subtitle && <div className="text-xs text-slate-400 leading-snug">{subtitle}</div>}
      </div>
    </motion.div>
  )
}
