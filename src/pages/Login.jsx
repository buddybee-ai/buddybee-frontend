import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ArrowRight } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useLang, LANGUAGES } from "../context/LanguageContext"
import { getT } from "../translations"
import SEO from "../components/SEO"
import { AuthArtPanel } from "../components/ui"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { lang, setLang } = useLang()
  const T = getT(lang)

  const [form,     setForm]     = useState({ email: "", password: "" })
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")
  const [showPass, setShowPass] = useState(false)

  const isUrdu = lang === "ur"
  const urduFont = isUrdu ? "'Noto Nastaliq Urdu', serif" : "inherit"

  const handleChange = (e) => {
    setError("")
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    try {
      setLoading(true)
      setError("")
      const response = await login(form.email, form.password)
      if (!response?.success) throw new Error(response?.message || T("login.invalid"))
      const role = (response.data?.role || "").toLowerCase().trim()
      const routes = { student: "/dashboard/student", parent: "/dashboard/parent", counselor: "/dashboard/counselor", admin: "/dashboard/admin" }
      const destination = routes[role]
      if (!destination) throw new Error(`Unknown role "${role}"`)
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message || T("login.invalid"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO path="/login" title="Log In" noindex />
      {isUrdu && (
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap');`}</style>
      )}

      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-white/97 backdrop-blur-sm rounded-[2.5rem] shadow-2xl border border-white/70 overflow-hidden grid lg:grid-cols-[1fr_1.15fr]"
        >
          {/* Left — shared brand artwork, same asset as the global background */}
          <AuthArtPanel
            eyebrow="A Gentle Reminder"
            title="You're never alone in this. 🐝"
            subtitle="BuddyBee is here whenever a student needs to talk — and here for the people who support them, too."
          />

          {/* Right — the form, unchanged in substance, restyled in presentation */}
          <div className="px-5 py-8 sm:px-12 sm:py-14 flex flex-col justify-center">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-8 sm:mb-10">
              <Link to="/" className="flex items-center gap-2 font-display font-bold text-base sm:text-lg text-slate-900 flex-shrink-0">
                <span className="text-2xl">🐝</span> BuddyBee <span className="text-primary-600">AI</span>
              </Link>
              <div className="flex gap-1 bg-slate-100 rounded-full p-1">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLang(l.code)}
                    title={l.label}
                    className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm flex items-center justify-center transition-colors duration-200 flex-shrink-0"
                  >
                    {lang === l.code && (
                      <motion.span
                        layoutId="login-lang-pill"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        className="absolute inset-0 bg-white rounded-full shadow-soft -z-10"
                      />
                    )}
                    {l.flag}
                  </button>
                ))}
              </div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-2"
              style={{ fontFamily: urduFont, direction: isUrdu ? 'rtl' : 'ltr', textAlign: isUrdu ? 'right' : 'left' }}
            >
              {T("login.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-sm text-slate-500 mb-8"
              style={{ fontFamily: urduFont, direction: isUrdu ? 'rtl' : 'ltr', textAlign: isUrdu ? 'right' : 'left' }}
            >
              {T("login.subtitle")}
            </motion.p>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-sm text-red-700 font-medium overflow-hidden"
                >
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" style={{ fontFamily: urduFont }}>
                  {T("login.emailLabel")}
                </label>
                <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-primary-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-500/10 transition-all duration-200">
                  <Mail size={17} className="ml-4 text-slate-400 flex-shrink-0" />
                  <input
                    type="email" name="email"
                    placeholder="you@example.com"
                    value={form.email} onChange={handleChange}
                    className="w-full bg-transparent px-3.5 py-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none"
                    required autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" style={{ fontFamily: urduFont }}>
                  {T("login.passLabel")}
                </label>
                <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-primary-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-500/10 transition-all duration-200">
                  <Lock size={17} className="ml-4 text-slate-400 flex-shrink-0" />
                  <input
                    type={showPass ? "text" : "password"} name="password"
                    placeholder="••••••••"
                    value={form.password} onChange={handleChange}
                    className="w-full bg-transparent px-3.5 py-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none"
                    required autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    tabIndex={-1}
                    className="mr-4 text-slate-400 hover:text-primary-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end -mt-1">
                <Link to="/forgot-password" className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 mt-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-2xl shadow-primary transition-all duration-300 hover:shadow-glow-lg disabled:opacity-70 disabled:pointer-events-none"
                style={{ fontFamily: urduFont }}
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> {T("login.signingIn")}</>
                ) : (
                  <>{T("login.signIn")} 🍯 <ArrowRight size={16} /></>
                )}
              </motion.button>
            </motion.form>

            <div className="relative text-center my-7">
              <div className="divider-fade absolute top-1/2 left-0 right-0" />
              <span className="relative bg-white px-3 text-xs text-slate-400">{T("common.or")}</span>
            </div>

            <p className="text-center text-sm text-slate-500" style={{ fontFamily: urduFont }}>
              {T("login.noAccount")}{" "}
              <Link to="/signup" className="text-primary-600 font-bold hover:underline">{T("login.signUp")}</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}
