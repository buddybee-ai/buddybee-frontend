import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Share2, CheckCircle2 } from 'lucide-react'
import SEO from '../components/SEO'

export default function Contact() {
  const [form, setForm] = useState({
    fullName: '', email: '', org: '', role: 'Teacher', message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="relative pt-20 min-h-screen overflow-hidden">
      <div className="absolute inset-0 grid-bg mask-fade-b -z-20" />
      <SEO
        path="/contact"
        title="Contact Us"
        description="Get in touch with the BuddyBee AI team to bring AI-powered student wellness support to your school or district."
      />
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <div className="section-label mb-6">Supportive Sophistication</div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Transforming School{' '}
              <span className="gradient-text italic">Wellness.</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-10">
              Experience how BuddyBee AI supports student mental health through proactive, empathetic AI intervention. Let's build a safer campus together.
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Mail size={18} className="text-primary-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Email Us</div>
                  <a href="mailto:hello@buddybee.ai" className="text-slate-900 font-medium hover:text-primary-600 transition-colors">
                    buddybeeai@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Share2 size={18} className="text-primary-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Follow Our Journey</div>
                  <div className="flex gap-3 mt-1">
                    {['LinkedIn', 'Twitter', 'Instagram'].map(s => (
                      <a key={s} href="#" className="text-sm text-slate-600 hover:text-primary-600 transition-colors font-medium">
                        {s}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Buddy mascot card */}
            <div className="relative inline-block">
              <div className="w-36 h-36 bg-slate-200 rounded-2xl flex items-center justify-center text-6xl">
                🐝
              </div>
              <div className="absolute -right-4 bottom-4 bg-white rounded-2xl shadow-card p-4 max-w-56 border border-slate-100">
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  "Hi! I'm Buddy. I help students find their voice and educators find peace of mind."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="card rounded-3xl shadow-glow-lg border border-slate-100"
          >
            <AnimatePresence>
            {submitted ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}>
                  <CheckCircle2 size={56} className="text-emerald-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">Request Received!</h3>
                <p className="text-slate-500">We'll be in touch within 24 hours to schedule your personalized demo.</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Request School Demo</h2>
                <p className="text-slate-500 text-sm mb-8">See our dashboard in action with a personalized tour.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
                      <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Alex Johnson"
                        required
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400
                          focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="alex@school.edu"
                        required
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400
                          focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Organization Name</label>
                      <input
                        name="org"
                        value={form.org}
                        onChange={handleChange}
                        placeholder="Springfield High School"
                        required
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400
                          focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Role</label>
                      <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900
                          focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all bg-white"
                      >
                        {['Teacher', 'Counselor', 'Principal', 'District Admin', 'Other'].map(r => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">How can we help?</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your school's wellness goals..."
                      rows={4}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400
                        focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <button type="submit" className="w-full btn-primary justify-center text-base py-4">
                    Request Free Demo
                  </button>

                  <p className="text-xs text-slate-400 text-center">
                    By submitting, you agree to our{' '}
                    <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>{' '}
                    and{' '}
                    <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>.
                  </p>
                </form>
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
