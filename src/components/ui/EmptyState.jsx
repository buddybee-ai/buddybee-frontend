import { motion } from 'framer-motion'

/**
 * EmptyState — consistent "nothing here yet" pattern for tables, lists,
 * inboxes, chat history, etc. Keeps icon/copy/action visually aligned
 * across every dashboard.
 */
export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center mb-4">
          <Icon size={24} />
        </div>
      )}
      <h3 className="font-display font-semibold text-slate-900 mb-1.5">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-5">{description}</p>}
      {action}
    </motion.div>
  )
}
