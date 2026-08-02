import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { useLang, LANGUAGES } from "../context/LanguageContext"
import { getT } from "../translations"
import SEO from "../components/SEO"

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

  const handleSignup = async (e) => {
    e.preventDefault()
    if (loading) return
    try {
      setLoading(true)
      setError("")
      const result = await signup(name, email, password, role, null)
      if (!result.success) throw new Error(result.message || T('common.error'))
      navigate("/login", { replace: true })
    } catch (err) {
      setError(err.message || T('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO path="/signup" title="Sign Up" noindex />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Poppins:wght@400;500;600&family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap');

        .signup-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fffbf0;
          font-family: 'Poppins', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 20px 0;
        }
        .signup-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0-2l26-15V18L28 2 2 18v31L28 64z' fill='%23f59e0b' fill-opacity='0.07'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }
        .blob { position: fixed; border-radius: 50%; filter: blur(80px); opacity: 0.25; pointer-events: none; z-index: 0; }
        .blob-1 { width: 400px; height: 400px; background: #fbbf24; top: -100px; right: -100px; }
        .blob-2 { width: 300px; height: 300px; background: #f59e0b; bottom: -80px; left: -80px; }

        .signup-card {
          position: relative; z-index: 1; background: white; border-radius: 24px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(245,158,11,0.12), 0 0 0 1px rgba(245,158,11,0.1);
          width: 100%; max-width: 440px; margin: 16px; overflow: hidden;
        }
        .card-header {
          background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%);
          padding: 36px 40px 28px; text-align: center; position: relative;
        }
        .card-header::after {
          content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
          height: 24px; background: white; border-radius: 24px 24px 0 0;
        }
        .bee-icon {
          font-size: 52px; display: block; margin-bottom: 8px;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.15));
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        .brand-name {
          font-family: 'Nunito', sans-serif; font-size: 26px; font-weight: 900;
          color: white; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .brand-name span { color: rgba(255,255,255,0.85); font-weight: 700; }

        .card-body { padding: 28px 40px 36px; }
        .welcome-text {
          font-family: ${isUrdu ? "'Noto Nastaliq Urdu', serif" : "'Nunito', sans-serif"};
          font-size: ${isUrdu ? '18px' : '20px'};
          font-weight: 800; color: #1c1917; margin: 0 0 4px;
          direction: ${isUrdu ? 'rtl' : 'ltr'};
          text-align: ${isUrdu ? 'right' : 'left'};
        }
        .sub-text {
          font-size: 13px; color: #78716c; margin: 0 0 16px;
          font-family: ${isUrdu ? "'Noto Nastaliq Urdu', serif" : "'Poppins', sans-serif"};
          direction: ${isUrdu ? 'rtl' : 'ltr'};
          text-align: ${isUrdu ? 'right' : 'left'};
        }

        /* Language Selector */
        .lang-section { margin-bottom: 18px; }
        .lang-label {
          display: block; font-size: 11px; font-weight: 700; color: #92400e;
          text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;
          font-family: 'Nunito', sans-serif;
        }
        .lang-pills { display: flex; gap: 6px; }
        .lang-pill {
          flex: 1; padding: 9px 6px; border: 1.5px solid #e7e5e4; border-radius: 12px;
          background: #fafaf9; cursor: pointer; transition: all 0.15s; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 2px;
        }
        .lang-pill:hover { border-color: #f59e0b; background: #fffbeb; }
        .lang-pill.active {
          border-color: #f59e0b; background: linear-gradient(135deg, #fffbeb, #fef3c7);
          box-shadow: 0 0 0 3px rgba(245,158,11,0.15);
        }
        .lang-pill-flag { font-size: 18px; line-height: 1; }
        .lang-pill-native {
          font-size: 11px; font-weight: 700; color: #78716c; line-height: 1.2;
          font-family: ${isUrdu ? "'Noto Nastaliq Urdu', serif" : "'Nunito', sans-serif"};
        }
        .lang-pill.active .lang-pill-native { color: #b45309; }

        .role-toggle { display: flex; gap: 8px; margin-bottom: 14px; }
        .role-pill {
          flex: 1; padding: 11px 8px; border: 1.5px solid #e7e5e4; border-radius: 12px;
          background: #fafaf9;
          font-size: ${isUrdu ? '14px' : '13px'};
          font-family: ${isUrdu ? "'Noto Nastaliq Urdu', serif" : "'Nunito', sans-serif"};
          font-weight: 700; color: #78716c; cursor: pointer; transition: all 0.15s; text-align: center;
          direction: ${isUrdu ? 'rtl' : 'ltr'};
        }
        .role-pill:hover { border-color: #f59e0b; color: #f59e0b; }
        .role-pill.active {
          border-color: #f59e0b; background: #fffbeb; color: #b45309;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.1);
        }

        .counselor-notice {
          background: #f0f9ff; border: 1.5px solid #bae6fd; border-radius: 12px;
          padding: 12px 16px; margin-bottom: 14px;
          font-size: ${isUrdu ? '13px' : '12.5px'};
          color: #0369a1; line-height: ${isUrdu ? '2' : '1.6'};
          font-family: ${isUrdu ? "'Noto Nastaliq Urdu', serif" : "'Poppins', sans-serif"};
          direction: ${isUrdu ? 'rtl' : 'ltr'};
          text-align: ${isUrdu ? 'right' : 'left'};
        }

        .field-group { margin-bottom: 14px; }
        .field-label {
          display: block; font-size: 12px; font-weight: 600; color: #57534e;
          text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px;
          font-family: 'Nunito', sans-serif;
        }
        .field-wrap { position: relative; }
        .field-input {
          width: 100%; padding: 12px 16px; border: 1.5px solid #e7e5e4; border-radius: 12px;
          font-size: 14px; font-family: 'Poppins', sans-serif; color: #1c1917; background: #fafaf9;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box; outline: none; appearance: none;
          direction: ltr; text-align: left;
        }
        .field-input:focus { border-color: #f59e0b; background: white; box-shadow: 0 0 0 3px rgba(245,158,11,0.12); }
        .field-input.has-toggle { padding-right: 46px; }
        .toggle-btn {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #a8a29e; font-size: 16px;
          padding: 4px; line-height: 1; transition: color 0.2s;
        }
        .toggle-btn:hover { color: #f59e0b; }

        .error-banner {
          background: #fff1f2; border: 1px solid #fecdd3; border-radius: 10px;
          padding: 10px 14px; margin-bottom: 18px; display: flex; align-items: center;
          gap: 8px; font-size: 13px; color: #e11d48; font-weight: 500;
          direction: ${isUrdu ? 'rtl' : 'ltr'};
        }

        .submit-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
          color: white; border: none; border-radius: 12px;
          font-family: ${isUrdu ? "'Noto Nastaliq Urdu', serif" : "'Nunito', sans-serif"};
          font-size: ${isUrdu ? '15px' : '16px'}; font-weight: 800;
          cursor: pointer; transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 4px 14px rgba(245,158,11,0.35); letter-spacing: 0.3px; margin-top: 8px;
          direction: ${isUrdu ? 'rtl' : 'ltr'};
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,158,11,0.45); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          display: inline-block; width: 16px; height: 16px;
          border: 2.5px solid rgba(255,255,255,0.4); border-top-color: white;
          border-radius: 50%; animation: spin 0.7s linear infinite;
          vertical-align: middle; margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          text-align: center; margin: 20px 0; position: relative; font-size: 12px; color: #a8a29e;
        }
        .divider::before, .divider::after {
          content: ''; position: absolute; top: 50%; width: calc(50% - 16px); height: 1px; background: #e7e5e4;
        }
        .divider::before { left: 0; }
        .divider::after { right: 0; }

        .login-cta {
          text-align: center; font-size: 13.5px; color: #78716c;
          font-family: ${isUrdu ? "'Noto Nastaliq Urdu', serif" : "'Poppins', sans-serif"};
          direction: ${isUrdu ? 'rtl' : 'ltr'};
        }
        .login-cta a { color: #f59e0b; font-weight: 700; text-decoration: none; font-family: 'Nunito', sans-serif; }
        .login-cta a:hover { text-decoration: underline; }

        /* Urdu RTL field labels */
        .urdu-label {
          direction: rtl; text-align: right; text-transform: none; letter-spacing: 0;
          font-family: 'Noto Nastaliq Urdu', serif; font-size: 13px;
        }
      `}</style>

      <div className="signup-root">
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        <div className="signup-card">
          <div className="card-header">
            <span className="bee-icon">🐝</span>
            <div className="brand-name">Buddy<span>Bee</span> AI</div>
          </div>

          <div className="card-body">
            <h2 className="welcome-text">{T('signup.title')}</h2>
            <p className="sub-text">{T('signup.subtitle')}</p>

            {/* ── Language Selector ── */}
            <div className="lang-section">
              <span className="lang-label">🌐 {T('common.language')}</span>
              <div className="lang-pills">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    type="button"
                    className={`lang-pill ${lang === l.code ? 'active' : ''}`}
                    onClick={() => setLang(l.code)}
                    title={l.label}
                  >
                    <span className="lang-pill-flag">{l.flag}</span>
                    <span className="lang-pill-native">{l.native}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Role selector ── */}
            <div className="role-toggle">
              <button
                type="button"
                className={`role-pill ${role === 'student' ? 'active' : ''}`}
                onClick={() => setRole('student')}
              >
                {T('signup.student')}
              </button>
              <button
                type="button"
                className={`role-pill ${role === 'parent' ? 'active' : ''}`}
                onClick={() => setRole('parent')}
              >
                {T('signup.parent')}
              </button>
            </div>

            {/* ── Counselor notice ── */}
            <div className="counselor-notice">
              {T('signup.counselorNotice')}
            </div>

            {error && (
              <div className="error-banner">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSignup}>
              <div className="field-group">
                <label className={`field-label ${isUrdu ? 'urdu-label' : ''}`}>
                  {T('common.name')}
                </label>
                <div className="field-wrap">
                  <input
                    type="text"
                    placeholder={T('signup.namePlaceholder')}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="field-input"
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className={`field-label ${isUrdu ? 'urdu-label' : ''}`}>
                  {T('common.email')}
                </label>
                <div className="field-wrap">
                  <input
                    type="email"
                    placeholder={T('signup.emailPlaceholder')}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="field-input"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className={`field-label ${isUrdu ? 'urdu-label' : ''}`}>
                  {T('common.password')}
                </label>
                <div className="field-wrap">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder={T('signup.passwordPlaceholder')}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="field-input has-toggle"
                    required
                    autoComplete="new-password"
                  />
                  <button type="button" className="toggle-btn"
                    onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading
                  ? <><span className="spinner" />{T('signup.creating')}</>
                  : T('signup.createAccount')
                }
              </button>
            </form>

            <div className="divider">{T('common.or')}</div>

            <p className="login-cta">
              {T('signup.alreadyHave')}{" "}
              <Link to="/login">{T('signup.signIn')}</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
