import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Info, ArrowRight } from "lucide-react"
import { useLang, LANGUAGES } from "../context/LanguageContext"
import { getT } from "../translations"
import SEO from "../components/SEO"
import { AuthArtPanel } from "../components/ui"

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const { lang, setLang } = useLang()
  const T = getT(lang)

  const [name,     setName]     = useState("")
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [role,     setRole]     = useState("student")
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState("")
  const [showPass, setShowPass] = useState(false)

  const isUrdu = lang === 'ur'
  const urduFont = isUrdu ? "'Noto Nastaliq Urdu', serif" : "inherit"

  const handleSignup = async (e) => {
    e.preventDefault()
    if (loading) return
    try {
      setLoading(true)
      setError("")
      const result = await signup(name, email, password, role, null)
      if (!result.success) throw new Error(result.message || T('common.error'))
      // Signup now auto-authenticates (the backend sets the same session
      // cookies login does) — go straight into the app instead of asking
      // a brand-new user to immediately re-enter the password they just
      // chose. Only "student" self-registers here, so /dashboard/chat is
      // always the right destination.
      navigate("/dashboard/chat", { replace: true })
    } catch (err) {
      setError(err.message || T('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO path="/signup" title="Sign Up" noindex />
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
            eyebrow="Join BuddyBee"
            title="A caring companion for every student. 🐝"
            subtitle="Set up your account in a minute — BuddyBee and your school's care team take it from there."
          />

          {/* Right — the form, unchanged in substance, restyled in presentation */}
          <div className="px-5 py-8 sm:px-12 sm:py-12 flex flex-col justify-center">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-6 sm:mb-8">
              <Link to="/" className="flex items-center gap-2 font-display font-bold text-base sm:text-lg text-slate-900 flex-shrink-0">
                <span className="text-2xl">🐝</span> BuddyBee <span className="text-primary-600">AI</span>
              </Link>
              <div className="flex gap-1 bg-slate-100 rounded-full p-1">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    type="button"
                    title={l.label}
                    onClick={() => setLang(l.code)}
                    className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm flex items-center justify-center transition-colors duration-200 flex-shrink-0"
                  >
                    {lang === l.code && (
                      <motion.span
                        layoutId="signup-lang-pill"
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
              {T('signup.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-sm text-slate-500 mb-6"
              style={{ fontFamily: urduFont, direction: isUrdu ? 'rtl' : 'ltr', textAlign: isUrdu ? 'right' : 'left' }}
            >
              {T('signup.subtitle')}
            </motion.p>

            {/* Role selector */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 ${
                  role === 'student'
                    ? 'border-primary-400 bg-primary-50 text-primary-700 ring-4 ring-primary-500/10'
                    : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-primary-300'
                }`}
                style={{ fontFamily: urduFont }}
              >
                {T('signup.student')}
              </button>
              {/* Parent registration disabled — re-enable when Parent Dashboard launches */}
            </div>

            {/* Counselor notice */}
            <div
              className="flex gap-2 items-start bg-blue-50 border border-blue-200/70 rounded-xl px-3.5 py-3 mb-5 text-xs text-blue-700 leading-relaxed"
              style={{ fontFamily: urduFont, direction: isUrdu ? 'rtl' : 'ltr', textAlign: isUrdu ? 'right' : 'left' }}
            >
              <Info size={14} className="flex-shrink-0 mt-0.5" />
              <span>{T('signup.counselorNotice')}</span>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
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
              onSubmit={handleSignup}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" style={{ fontFamily: urduFont }}>
                  {T('common.name')}
                </label>
                <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-primary-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-500/10 transition-all duration-200">
                  <User size={17} className="ml-4 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder={T('signup.namePlaceholder')}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-transparent px-3.5 py-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none"
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" style={{ fontFamily: urduFont }}>
                  {T('common.email')}
                </label>
                <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-primary-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-500/10 transition-all duration-200">
                  <Mail size={17} className="ml-4 text-slate-400 flex-shrink-0" />
                  <input
                    type="email"
                    placeholder={T('signup.emailPlaceholder')}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-transparent px-3.5 py-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" style={{ fontFamily: urduFont }}>
                  {T('common.password')}
                </label>
                <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-primary-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-500/10 transition-all duration-200">
                  <Lock size={17} className="ml-4 text-slate-400 flex-shrink-0" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder={T('signup.passwordPlaceholder')}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-transparent px-3.5 py-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none"
                    required
                    autoComplete="new-password"
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

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 mt-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-2xl shadow-primary transition-all duration-300 hover:shadow-glow-lg disabled:opacity-70 disabled:pointer-events-none"
                style={{ fontFamily: urduFont }}
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> {T('signup.creating')}</>
                ) : (
                  <>{T('signup.createAccount')} <ArrowRight size={16} /></>
                )}
              </motion.button>
            </motion.form>

            <div className="relative text-center my-6">
              <div className="divider-fade absolute top-1/2 left-0 right-0" />
              <span className="relative bg-white px-3 text-xs text-slate-400">{T('common.or')}</span>
            </div>

            <p className="text-center text-sm text-slate-500" style={{ fontFamily: urduFont }}>
              {T('signup.alreadyHave')}{" "}
              <Link to="/login" className="text-primary-600 font-bold hover:underline">{T('signup.signIn')}</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  )
}
