import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowRight, Twitter, Linkedin, Instagram, Mail, CheckCircle2 } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'Features', to: '/features' },
    { label: 'Schools', to: '/schools' },
    { label: 'Try Demo', to: '/demo' },
    { label: 'Dashboard', to: '/dashboard' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Blog', to: '#' },
    { label: 'Careers', to: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Service', to: '#' },
    { label: 'HIPAA Compliance', to: '#' },
    { label: 'Security', to: '#' },
  ],
}

const socials = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
]

function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Presentational only — there is no newsletter API on the backend yet,
  // so this simply confirms receipt client-side rather than calling out.
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
      <div>
        <div className="flex items-center gap-2 text-white font-display font-bold text-lg mb-1.5">
          <Mail size={18} className="text-primary-400" /> Stay in the loop
        </div>
        <p className="text-sm text-slate-400 max-w-sm">Product updates and wellness research, roughly once a month. No spam, ever.</p>
      </div>
      {submitted ? (
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold flex-shrink-0">
          <CheckCircle2 size={18} /> Thanks — you're on the list!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex w-full sm:w-auto gap-2 flex-shrink-0">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.edu"
            className="flex-1 sm:w-64 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition-all"
          />
          <button
            type="submit"
            className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 hover:bg-primary-500 text-white flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
            aria-label="Subscribe"
          >
            <ArrowRight size={16} />
          </button>
        </form>
      )}
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="relative bg-ink-900 text-slate-400 overflow-hidden">
      {/* subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-40 bg-primary-600/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="mb-14">
          <Newsletter />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-3">
            <Link to="/" className="inline-flex items-center gap-2 font-display font-bold text-2xl text-white mb-4">
              <span className="text-3xl">🐝</span>
              <span>BuddyBee AI</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 max-w-sm mb-6">
              Nurturing student minds with supportive, AI-powered conversations. Empowering educators with data-driven insights.
            </p>
            <div className="flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-600 hover:border-primary-600 transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h3 className="font-semibold text-white text-sm mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-1 text-sm text-slate-500 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                      <ArrowUpRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CTA */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-white text-sm mb-4">Get started</h3>
            <p className="text-sm text-slate-500 mb-4">See BuddyBee in your school.</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors"
            >
              Request a demo <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        <div className="divider-fade !via-white/10 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-10">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} BuddyBee AI. FERPA &amp; HIPAA compliant · Student privacy-first architecture.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span>Made with</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="text-yellow-500"
            >💛</motion.span>
            <span>for student wellness</span>
          </div>
        </div>
      </div>

      {/* Giant background wordmark */}
      <div className="relative overflow-hidden select-none pointer-events-none" aria-hidden="true">
        <div className="font-display font-bold text-white/[0.04] text-center leading-none whitespace-nowrap"
          style={{ fontSize: 'clamp(4rem, 16vw, 12rem)', marginBottom: '-2.5vw' }}
        >
          BuddyBee AI
        </div>
      </div>
    </footer>
  )
}
