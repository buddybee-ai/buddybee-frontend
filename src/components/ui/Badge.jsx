const COLORS = {
  primary: 'bg-primary-50 text-primary-700 border-primary-200/70',
  slate:   'bg-slate-100 text-slate-600 border-slate-200',
  green:   'bg-emerald-50 text-emerald-700 border-emerald-200/70',
  red:     'bg-red-50 text-red-700 border-red-200/70',
  amber:   'bg-amber-50 text-amber-700 border-amber-200/70',
  blue:    'bg-blue-50 text-blue-700 border-blue-200/70',
  purple:  'bg-purple-50 text-purple-700 border-purple-200/70',
  dark:    'bg-white/10 text-white border-white/20',
}

export default function Badge({ children, color = 'primary', icon: Icon, dot = false, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${COLORS[color] ?? COLORS.primary} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-soft" />}
      {Icon && <Icon size={12} />}
      {children}
    </span>
  )
}
