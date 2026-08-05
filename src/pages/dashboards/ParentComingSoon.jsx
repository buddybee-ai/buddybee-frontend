import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function ParentComingSoon() {
  return (
    <>
      {/* Inline styles for dark mode support without external deps */}
      <style>{`
        @media (prefers-color-scheme: dark) {
          .pcs-root { background: #0f172a !important; }
          .pcs-card { background: rgba(30,41,59,0.7) !important; border-color: rgba(100,116,139,0.3) !important; }
          .pcs-title { color: #f1f5f9 !important; }
          .pcs-sub { color: #94a3b8 !important; }
          .pcs-body { color: #cbd5e1 !important; }
          .pcs-badge { background: rgba(92,92,232,0.18) !important; color: #c7c7ff !important; border-color: rgba(92,92,232,0.3) !important; }
          .pcs-divider { border-color: rgba(100,116,139,0.3) !important; }
          .pcs-feature { background: rgba(30,41,59,0.5) !important; }
          .pcs-feature-title { color: #e2e8f0 !important; }
          .pcs-feature-body { color: #94a3b8 !important; }
        }
      `}</style>

      <div className="pcs-root min-h-screen flex items-center justify-center p-5 transition-colors">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="pcs-card max-w-lg w-full bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-2xl shadow-primary/10 p-8 sm:p-10 text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 mb-6"
          >
            <span className="text-4xl">🐝</span>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="pcs-badge inline-flex items-center gap-1.5 text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse-soft" />
              Coming Soon
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pcs-title text-2xl sm:text-3xl font-bold text-slate-900 mt-5"
          >
            Parent Dashboard
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pcs-body text-sm sm:text-base text-slate-600 mt-4 leading-relaxed max-w-sm mx-auto"
          >
            We're building powerful AI&#8209;powered parental insights while maintaining
            student privacy. The Parent Dashboard will be available in a future release.
          </motion.p>

          {/* Divider */}
          <div className="pcs-divider border-t border-slate-200/60 my-6" />

          {/* Feature preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 gap-3 text-left"
          >
            {[
              { icon: '📊', title: 'Wellness Insights', desc: 'Aggregated wellness trends without exposing private conversations.' },
              { icon: '🔔', title: 'Smart Alerts', desc: 'Get notified when your child may need extra support.' },
              { icon: '🛡️', title: 'Privacy First', desc: 'Built on the same privacy engine that protects student data.' },
              { icon: '📈', title: 'Progress Tracking', desc: 'See long-term wellness improvements over weeks and months.' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="pcs-feature bg-slate-50/80 rounded-xl p-3"
              >
                <div className="text-lg mb-1">{f.icon}</div>
                <div className="pcs-feature-title text-xs font-bold text-slate-800">{f.title}</div>
                <div className="pcs-feature-body text-[10px] text-slate-500 mt-0.5 leading-snug">{f.desc}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary hover:shadow-glow-lg hover:scale-[1.02] transition-all"
            >
              ← Back to BuddyBee
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="pcs-sub text-[11px] text-slate-400 mt-4"
          >
            BuddyBee AI — Mental wellness, powered by empathy.
          </motion.p>
        </motion.div>
      </div>
    </>
  )
}
