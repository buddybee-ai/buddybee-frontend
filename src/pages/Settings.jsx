import { useEffect, useState } from "react"
import { Bell, Lock, User, Globe, Shield, Palette, Brain, LogOut, Save, Eye, EyeOff, MessageSquare, Info } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useLang, LANGUAGES } from "../context/LanguageContext"
import { updateProfile, changePassword } from "../api"
import SEO from "../components/SEO"

const PREF_KEY="buddybee_settings"

const defaults={
  emailNotifications:true, wellnessReminders:true, riskAlerts:true,
  anonymousAnalytics:true, aiPersonalization:true, showOnlineStatus:false,
  theme:"system", compactMode:false,
  responseLength:"balanced", emojiLevel:"normal", genZMode:true
}

export default function Settings(){
  const {user, refreshUser, logout}=useAuth()
  const {lang,setLang}=useLang()
  const [profile,setProfile]=useState({name:user?.name||"",email:user?.email||""})
  const [password,setPassword]=useState({current:"",next:"",confirm:""})
  const [showCurrent,setShowCurrent]=useState(false), [showNext,setShowNext]=useState(false)
  const [prefs,setPrefs]=useState(()=>({...defaults,...JSON.parse(localStorage.getItem(PREF_KEY)||"{}")}))
  const [message,setMessage]=useState(""), [error,setError]=useState("")

  useEffect(()=>{setProfile({name:user?.name||"",email:user?.email||""})},[user])

  // Apply the theme preference — previously stored but never actually applied.
  useEffect(()=>{
    const root=document.documentElement
    const wantsDark = prefs.theme==="dark" ||
      (prefs.theme==="system" && window.matchMedia?.("(prefers-color-scheme: dark)").matches)
    root.classList.toggle("dark", wantsDark)
  },[prefs.theme])

  const flash=(m,isError=false)=>{setError(isError?m:"");setMessage(isError?"":m);setTimeout(()=>{setMessage("");setError("")},3000)}
  const savePrefs=(patch)=>{const next={...prefs,...patch};setPrefs(next);localStorage.setItem(PREF_KEY,JSON.stringify(next));flash("Settings saved.")}

  const saveProfile=async(e)=>{
    e.preventDefault(); setError(""); setMessage("")
    try{await updateProfile(profile.name,profile.email);await refreshUser();flash("Profile updated successfully.")}
    catch(err){flash(err.response?.data?.detail||"Could not update your profile.",true)}
  }

  const savePassword=async(e)=>{
    e.preventDefault();setError("");setMessage("")
    if(password.next.length<8)return flash("New password must be at least 8 characters.",true)
    if(password.next!==password.confirm)return flash("New passwords do not match.",true)
    try{await changePassword(password.current,password.next);setPassword({current:"",next:"",confirm:""});flash("Password changed successfully.")}
    catch(err){flash(err.response?.data?.detail||"Could not change password.",true)}
  }

  return <div className="max-w-5xl mx-auto px-2 pb-10">
    <SEO path="/dashboard/settings" title="Settings" noindex />
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-black text-slate-900">Settings</h1>
      <p className="text-sm text-slate-500 mt-1">Manage your BuddyBee account, security, preferences and privacy.</p>
    </div>
    {(message||error)&&<div className={`mb-5 rounded-xl border p-3 text-sm font-semibold ${error?"bg-red-50 border-red-200 text-red-600":"bg-emerald-50 border-emerald-200 text-emerald-700"}`}>{message||error}</div>}

    <Section icon={User} title="Account" description="Your personal account information.">
      <form onSubmit={saveProfile} className="grid md:grid-cols-2 gap-4">
        <Field label="Full name"><input className={input} value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} required /></Field>
        <Field label="Email address"><input className={input} type="email" value={profile.email} onChange={e=>setProfile({...profile,email:e.target.value})} required /></Field>
        <div className="md:col-span-2 flex items-center justify-between pt-2"><span className="text-xs text-slate-400">Role: <b>{user?.roleLabel||user?.role}</b></span><button className={primary}><Save size={15}/>Save profile</button></div>
      </form>
    </Section>

    <Section icon={Lock} title="Password & security" description="Change your password or recover access if you forget it.">
      <form onSubmit={savePassword} className="space-y-4">
        <PasswordField label="Current password" value={password.current} onChange={v=>setPassword({...password,current:v})} show={showCurrent} toggle={()=>setShowCurrent(!showCurrent)}/>
        <div className="grid md:grid-cols-2 gap-4">
          <PasswordField label="New password" value={password.next} onChange={v=>setPassword({...password,next:v})} show={showNext} toggle={()=>setShowNext(!showNext)}/>
          <Field label="Confirm new password"><input className={input} type="password" value={password.confirm} onChange={e=>setPassword({...password,confirm:e.target.value})} autoComplete="new-password"/></Field>
        </div>
        <div className="flex justify-end"><button className={primary}>Update password</button></div>
      </form>
      <div className="mt-5 border-t pt-4 text-sm text-slate-500">Forgot your password? <a className="text-indigo-600 font-semibold" href="/forgot-password">Send yourself a reset link.</a></div>
    </Section>

    <Section icon={Globe} title="Language & regional" description="Choose the language used throughout BuddyBee.">
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map(l=><button key={l.code} onClick={()=>{setLang(l.code);savePrefs({language:l.code})}} className={`px-4 py-2.5 rounded-xl border text-sm font-semibold ${lang===l.code?"border-indigo-500 bg-indigo-50 text-indigo-700":"border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{l.flag} {l.native}</button>)}
      </div>
    </Section>

    <Section icon={Bell} title="Notifications" description="Control what BuddyBee sends you.">
      <Toggle label="Email notifications" description="Product updates and important account messages." value={prefs.emailNotifications} onChange={v=>savePrefs({emailNotifications:v})}/>
      <Toggle label="Wellness reminders" description="Gentle reminders to check in with your wellbeing." value={prefs.wellnessReminders} onChange={v=>savePrefs({wellnessReminders:v})}/>
      <Toggle label="Risk & safety alerts" description="Important alerts related to wellbeing and counselor escalation." value={prefs.riskAlerts} onChange={v=>savePrefs({riskAlerts:v})}/>
    </Section>

    <Section icon={Palette} title="Appearance & accessibility" description="Personalize how the dashboard feels.">
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Field label="Theme"><select className={input} value={prefs.theme} onChange={e=>savePrefs({theme:e.target.value})}><option value="system">System default</option><option value="light">Light</option><option value="dark">Dark</option></select></Field>
      </div>
      <Toggle label="Compact mode" description="Use tighter spacing in dashboard lists and panels." value={prefs.compactMode} onChange={v=>savePrefs({compactMode:v})}/>
    </Section>

    <Section icon={Brain} title="AI & personalization" description="Control how BuddyBee personalizes your experience.">
      <Toggle label="AI personalization" description="Allow BuddyBee to use your in-app preferences and history to tailor responses." value={prefs.aiPersonalization} onChange={v=>savePrefs({aiPersonalization:v})}/>
      <Toggle label="Anonymous analytics" description="Help improve BuddyBee with aggregated, non-identifying usage data." value={prefs.anonymousAnalytics} onChange={v=>savePrefs({anonymousAnalytics:v})}/>
    </Section>

    <Section icon={MessageSquare} title="Chat" description="Fine-tune how BuddyBee talks with you.">
      <div className="grid md:grid-cols-2 gap-4 mb-1">
        <Field label="AI response length">
          <select className={input} value={prefs.responseLength} onChange={e=>savePrefs({responseLength:e.target.value})}>
            <option value="short">Short</option>
            <option value="balanced">Balanced</option>
            <option value="detailed">Detailed</option>
          </select>
        </Field>
        <Field label="Emoji level">
          <select className={input} value={prefs.emojiLevel} onChange={e=>savePrefs({emojiLevel:e.target.value})}>
            <option value="minimal">Minimal</option>
            <option value="normal">Normal</option>
            <option value="expressive">Expressive</option>
          </select>
        </Field>
      </div>
      <Toggle label="Gen-Z mode" description="Let BuddyBee use casual, Gen-Z style language when it fits naturally." value={prefs.genZMode} onChange={v=>savePrefs({genZMode:v})}/>
      <div className="mt-4">
        <button
          type="button"
          onClick={()=>savePrefs({responseLength:defaults.responseLength, emojiLevel:defaults.emojiLevel, genZMode:defaults.genZMode})}
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 underline underline-offset-2"
        >
          Reset chat preferences to default
        </button>
      </div>
    </Section>

    <Section icon={Shield} title="Privacy" description="Manage visibility and privacy preferences.">
      <Toggle label="Show online status" description="Allow other authorized users to see when you are active." value={prefs.showOnlineStatus} onChange={v=>savePrefs({showOnlineStatus:v})}/>
      <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-500 leading-relaxed space-y-1.5">
        <p>Your conversations with BuddyBee stay private.</p>
        <p>Counselors only ever see general wellbeing insights — never your actual messages — except where an immediate safety concern requires action.</p>
        <p>Privacy controls here do not disable critical safety workflows.</p>
      </div>
    </Section>

    <Section icon={Info} title="About" description="App info and support.">
      <div className="text-sm text-slate-600 space-y-2">
        <div className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400">App version</span><span className="font-semibold">1.0.0</span></div>
        <div className="border-b border-slate-100 pb-2"><a href="#" className="text-indigo-600 font-semibold">Privacy Policy</a></div>
        <div className="border-b border-slate-100 pb-2"><a href="#" className="text-indigo-600 font-semibold">Terms of Service</a></div>
        <div className="pb-1"><a href="/contact" className="text-indigo-600 font-semibold">Contact Support</a></div>
      </div>
    </Section>

    <Section icon={LogOut} title="Session" description="Sign out from this device.">
      <button onClick={()=>{logout();window.location.href="/login"}} className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50">Sign out</button>
    </Section>
  </div>
}

const input="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
const primary="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"

function Section({icon:Icon,title,description,children}){return <section className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 md:p-6 mb-4"><div className="flex gap-3 mb-5"><div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><Icon size={19}/></div><div><h2 className="font-bold text-slate-900">{title}</h2><p className="text-xs text-slate-500 mt-0.5">{description}</p></div></div>{children}</section>}
function Field({label,children}){return <label className="block text-xs font-semibold text-slate-600">{label}<div className="mt-2">{children}</div></label>}
function PasswordField({label,value,onChange,show,toggle}){return <Field label={label}><div className="relative"><input className={`${input} pr-11`} type={show?"text":"password"} value={value} onChange={e=>onChange(e.target.value)} autoComplete="current-password"/><button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></Field>}
function Toggle({label,description,value,onChange}){return <div className="flex items-center justify-between gap-4 py-3 border-b last:border-0 border-slate-100"><div><div className="text-sm font-semibold text-slate-800">{label}</div><div className="text-xs text-slate-500 mt-0.5">{description}</div></div><button type="button" role="switch" aria-checked={value} onClick={()=>onChange(!value)} className={`w-11 h-6 rounded-full p-1 transition ${value?"bg-indigo-600":"bg-slate-300"}`}><span className={`block w-4 h-4 bg-white rounded-full transition ${value?"translate-x-5":"translate-x-0"}`}/></button></div>}
