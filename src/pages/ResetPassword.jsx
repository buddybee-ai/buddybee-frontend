import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { resetPassword } from "../api"
import SEO from "../components/SEO"

export default function ResetPassword() {
  const [params] = useSearchParams()
  const navigate=useNavigate()
  const token=params.get("token") || ""
  const [password,setPassword]=useState("")
  const [confirm,setConfirm]=useState("")
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState("")
  const [done,setDone]=useState(false)

  const submit=async(e)=>{
    e.preventDefault(); setError("")
    if(password.length<8) return setError("Password must be at least 8 characters.")
    if(password!==confirm) return setError("Passwords do not match.")
    if(!token) return setError("This reset link is missing or invalid.")
    setLoading(true)
    try { await resetPassword(token,password); setDone(true); setTimeout(()=>navigate("/login"),1200) }
    catch(err){ setError(err.response?.data?.detail || "This reset link is invalid or has expired.") }
    finally{ setLoading(false) }
  }

  return <>
  <SEO path="/reset-password" title="Reset Password" noindex />
  <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-br from-amber-500 to-yellow-400 p-8 text-center text-white"><div className="text-5xl">🐝</div><div className="font-black text-2xl mt-2">BuddyBee AI</div></div>
      <div className="p-8">
        <h1 className="text-2xl font-black text-slate-900">Create a new password</h1>
        <p className="text-sm text-slate-500 mt-2 mb-6">Choose a strong password with at least 8 characters.</p>
        {done ? <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 text-sm font-semibold">Password reset successfully. Redirecting to sign in…</div> :
        <form onSubmit={submit} className="space-y-4">
          {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm p-3">{error}</div>}
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500" type="password" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="new-password" />
          <input className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500" type="password" placeholder="Confirm new password" value={confirm} onChange={e=>setConfirm(e.target.value)} required autoComplete="new-password" />
          <button disabled={loading} className="w-full rounded-xl bg-indigo-600 text-white py-3 font-bold hover:bg-indigo-700 disabled:opacity-60">{loading?"Updating…":"Reset password"}</button>
        </form>}
        <p className="text-center text-sm text-slate-500 mt-5"><Link className="text-indigo-600 font-semibold" to="/login">Back to sign in</Link></p>
      </div>
    </div>
  </div>
  </>
}
