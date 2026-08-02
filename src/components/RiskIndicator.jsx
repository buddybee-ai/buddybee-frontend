import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react'

const LEVELS = {
  low: {
    label: 'Low Risk',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    bar: 'bg-emerald-500',
    barWidth: '25%',
    icon: CheckCircle2,
    dot: 'bg-emerald-500',
    glow: 'shadow-emerald-100',
  },
  medium: {
    label: 'Medium Risk',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    bar: 'bg-orange-500',
    barWidth: '55%',
    icon: Info,
    dot: 'bg-orange-500',
    glow: 'shadow-orange-100',
  },
  high: {
    label: 'High Risk',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    bar: 'bg-red-500',
    barWidth: '85%',
    icon: AlertTriangle,
    dot: 'bg-red-500',
    glow: 'shadow-red-100',
  },
  critical: {
    label: 'Critical',
    color: 'text-red-900',
    bg: 'bg-red-100',
    border: 'border-red-300',
    bar: 'bg-red-700',
    barWidth: '98%',
    icon: ShieldAlert,
    dot: 'bg-red-700',
    glow: 'shadow-red-200',
  },
}

/** Inline badge variant */
export function RiskBadge({ level = 'low', size = 'sm' }) {
  const l = LEVELS[level] ?? LEVELS.low
  const Icon = l.icon
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1 font-semibold rounded-full border
        ${l.bg} ${l.color} ${l.border} ${padding}`}
    >
      <Icon size={size === 'sm' ? 11 : 13} />
      {l.label}
    </motion.span>
  )
}

/** Full card variant with progress bar */
export default function RiskIndicator({ level = 'low', score, context, delay = 0 }) {
  const l = LEVELS[level] ?? LEVELS.low
  const Icon = l.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-2xl border p-5 ${l.bg} ${l.border} shadow-sm`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${l.border} border bg-white shadow-sm`}>
            <Icon size={16} className={l.color} />
          </div>
          <div>
            <div className={`text-sm font-bold ${l.color}`}>{l.label}</div>
            {context && <div className="text-xs text-slate-500">{context}</div>}
          </div>
        </div>
        {score !== undefined && (
          <div className={`font-display text-2xl font-bold ${l.color}`}>{score}</div>
        )}
      </div>

      {/* Risk bar */}
      <div className="h-2 bg-white/60 rounded-full overflow-hidden border border-white">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: l.barWidth }}
          transition={{ duration: 0.8, delay: delay + 0.2, ease: 'easeOut' }}
          className={`h-full ${l.bar} rounded-full`}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-1.5">
        <span>Safe</span>
        <span>Critical</span>
      </div>
    </motion.div>
  )
}
