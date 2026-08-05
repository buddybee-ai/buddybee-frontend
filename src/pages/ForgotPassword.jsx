import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Loader2, AlertCircle, MailCheck, ArrowLeft } from "lucide-react"
import { requestPasswordReset } from "../api"
import SEO from "../components/SEO"
import { AuthShell } from "../components/ui"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError("")
    try { await requestPasswordReset(email); setSent(true) }
    catch (err) { setError(err.response?.data?.detail || err.displayMessage || "Unable to process the request.") }
    finally { setLoading(false) }
  }

  return (
    <>
      <SEO path="/forgot-password" title="Forgot Password" noindex />
      <AuthShell title="Forgot your password?" subtitle="Enter your email and we'll send you a secure reset link.">
        <AnimatePresence>
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                <MailCheck size={26} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Check your inbox</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                If an account exists for that email, a reset link has been sent. The link expires in 30 minutes.
              </p>
              <Link className="inline-flex items-center gap-1.5 mt-6 text-primary-600 font-semibold text-sm hover:underline" to="/login">
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </motion.div>
          ) : (
            <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={submit} className="space-y-4">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm p-3 overflow-hidden"
                  >
                    <AlertCircle size={16} className="flex-shrink-0" /> {error}
                  </motion.div>
                )}
              </AnimatePresence>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:border-primary-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-500/10 transition-all duration-200">
                  <Mail size={16} className="ml-3.5 text-slate-400" />
                  <input
                    className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 outline-none"
                    type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3.5 font-bold shadow-primary hover:shadow-glow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : "Send reset link"}
              </motion.button>
              <p className="text-center text-sm text-slate-500">
                <Link className="text-primary-600 font-semibold hover:underline" to="/login">Back to sign in</Link>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </AuthShell>
    </>
  )
}
