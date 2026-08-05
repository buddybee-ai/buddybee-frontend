import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { resetPassword } from "../api"
import SEO from "../components/SEO"
import { AuthShell } from "../components/ui"

export default function ResetPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get("token") || ""
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  const submit = async (e) => {
    e.preventDefault(); setError("")
    if (password.length < 8) return setError("Password must be at least 8 characters.")
    if (password !== confirm) return setError("Passwords do not match.")
    if (!token) return setError("This reset link is missing or invalid.")
    setLoading(true)
    try { await resetPassword(token, password); setDone(true); setTimeout(() => navigate("/login"), 1200) }
    catch (err) { setError(err.response?.data?.detail || "This reset link is invalid or has expired.") }
    finally { setLoading(false) }
  }

  return (
    <>
      <SEO path="/reset-password" title="Reset Password" noindex />
      <AuthShell title="Create a new password" subtitle="Choose a strong password with at least 8 characters.">
        <AnimatePresence>
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 text-sm font-semibold"
            >
              <CheckCircle2 size={20} className="flex-shrink-0" />
              Password reset successfully. Redirecting to sign in…
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

              <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:border-primary-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-500/10 transition-all duration-200">
                <Lock size={16} className="ml-3.5 text-slate-400" />
                <input
                  className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 outline-none"
                  type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password"
                />
              </div>
              <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50 focus-within:border-primary-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-500/10 transition-all duration-200">
                <Lock size={16} className="ml-3.5 text-slate-400" />
                <input
                  className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 outline-none"
                  type="password" placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3.5 font-bold shadow-primary hover:shadow-glow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Updating…</> : "Reset password"}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
        <p className="text-center text-sm text-slate-500 mt-5">
          <Link className="text-primary-600 font-semibold hover:underline" to="/login">Back to sign in</Link>
        </p>
      </AuthShell>
    </>
  )
}
