import { motion } from 'framer-motion'

/**
 * AuthShell — shared frame for secondary auth pages (forgot/reset password).
 * The global background (mounted once in main.jsx) already sits behind
 * everything, so this only needs to center the card.
 */
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-glow-lg border border-white/60 overflow-hidden"
      >
        <div className="relative bg-gradient-to-br from-primary-600 via-primary-600 to-primary-800 p-8 text-center overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative text-5xl"
          >🐝</motion.div>
          <div className="relative font-display font-extrabold text-2xl text-white mt-2">BuddyBee AI</div>
        </div>
        <div className="p-8">
          <h1 className="font-display text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">{subtitle}</p>
          {children}
        </div>
      </motion.div>
    </div>
  )
}
