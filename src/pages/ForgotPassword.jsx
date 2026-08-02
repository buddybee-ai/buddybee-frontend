import { useState } from "react"
import { Link } from "react-router-dom"
import { requestPasswordReset } from "../api"
import SEO from "../components/SEO"

export default function ForgotPassword() {
  const [email,setEmail]=useState("")
  const [loading,setLoading]=useState(false)
  const [sent,setSent]=useState(false)
  const [error,setError]=useState("")

  const submit=async(e)=>{
    e.preventDefault(); setLoading(true); setError("")
    try { await requestPasswordReset(email); setSent(true) }
    catch(err){ setError(err.response?.data?.detail || err.displayMessage || "Unable to process the request.") }
    finally{ setLoading(false) }
  }

  return <>
    <SEO path="/forgot-password" title="Forgot Password" noindex />
    <AuthShell title="Forgot your password?" subtitle="Enter your email and we'll send you a secure reset link.">    {sent ? (
      <div className="text-center">
        <div className="text-5xl mb-4">📩</div>
        <h3 className="text-lg font-bold text-slate-900">Check your inbox</h3>
        <p className="text-sm text-slate-500 mt-2">If an account exists for that email, a reset link has been sent. The link expires in 30 minutes.</p>
        <Link className="inline-block mt-6 text-indigo-600 font-semibold text-sm" to="/login">Back to sign in</Link>
      </div>
    ) : <form onSubmit={submit} className="space-y-4">
      {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm p-3">{error}</div>}
      <label className="block text-sm font-semibold text-slate-700">Email address
        <input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500" type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="email" />
      </label>
      <button disabled={loading} className="w-full rounded-xl bg-indigo-600 text-white py-3 font-bold hover:bg-indigo-700 disabled:opacity-60">{loading?"Sending…":"Send reset link"}</button>
      <p className="text-center text-sm text-slate-500"><Link className="text-indigo-600 font-semibold" to="/login">Back to sign in</Link></p>
    </form>}
  </AuthShell>
  </>
}

function AuthShell({title,subtitle,children}) {
  return <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-br from-amber-500 to-yellow-400 p-8 text-center text-white"><div className="text-5xl">🐝</div><div className="font-black text-2xl mt-2">BuddyBee AI</div></div>
      <div className="p-8"><h1 className="text-2xl font-black text-slate-900">{title}</h1><p className="text-sm text-slate-500 mt-2 mb-6">{subtitle}</p>{children}</div>
    </div>
  </div>
}

