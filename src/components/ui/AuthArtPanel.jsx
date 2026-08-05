import { motion } from 'framer-motion'
// Reuses the exact same swappable artwork as the sitewide GlobalBackground,
// so replacing src/assets/backgrounds/site-background.jpg updates both the
// global background AND this panel together — one asset, one source of truth.
import siteBackground from '../../assets/backgrounds/site-background.jpg'

/**
 * AuthArtPanel — the left-side artwork zone inside the Login/Signup card.
 * Same visual language as GlobalBackground (same image, same slow drift,
 * same warm/indigo glow accents) so the auth experience reads as part of
 * the same product rather than a separate design.
 */
export default function AuthArtPanel({ eyebrow, title, subtitle }) {
  return (
    <div className="relative hidden lg:block h-full overflow-hidden">
      <motion.img
        src={siteBackground}
        alt=""
        aria-hidden="true"
        animate={{ scale: [1, 1.06, 1], x: [0, 10, -6, 0], y: [0, -8, 5, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Depth glows — same palette as the global background */}
      <motion.div
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-56 h-56 rounded-full bg-primary-400/30 blur-3xl"
      />
      <motion.div
        animate={{ opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-amber-300/30 blur-3xl"
      />

      {/* Readability gradient for the quote block */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-ink-900/25" />

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-10 left-10 flex items-center gap-3"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">{eyebrow}</span>
        <span className="h-px w-14 bg-white/40" />
      </motion.div>

      {/* Quote block */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-10 left-10 right-10"
      >
        <h2 className="font-display text-3xl xl:text-4xl font-bold text-white leading-tight mb-3 text-balance">
          {title}
        </h2>
        <p className="text-sm text-white/70 leading-relaxed max-w-sm">{subtitle}</p>
      </motion.div>
    </div>
  )
}
