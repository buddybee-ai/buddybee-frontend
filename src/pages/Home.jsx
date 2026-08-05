import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, ArrowUpRight, CheckCircle2, Shield, Brain, TrendingUp,
  MessageSquare, AlertTriangle, HeartPulse, Sparkles, Users,
  BarChart2, Bell, FileText, UserCog, Activity, GraduationCap, Lock,
} from 'lucide-react'
import BeeMascot from '../components/BeeMascot'
import SEO from '../components/SEO'
import { Spotlight } from '../components/ui'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
}

/* ────────────────────────────────────────────────────────────────────────
   Hero visual — layered dashboard + chat mockup with mouse parallax
──────────────────────────────────────────────────────────────────────── */
function HeroVisual() {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 20 })
  const sy = useSpring(my, { stiffness: 120, damping: 20 })

  const rotateX = useTransform(sy, [-40, 40], [6, -6])
  const rotateY = useTransform(sx, [-40, 40], [-6, 6])
  const shiftX  = useTransform(sx, [-40, 40], [-10, 10])
  const shiftY  = useTransform(sy, [-40, 40], [-8, 8])

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mx.set(((e.clientX - rect.left) / rect.width) * 80 - 40)
    my.set(((e.clientY - rect.top) / rect.height) * 80 - 40)
  }
  const handleLeave = () => { mx.set(0); my.set(0) }

  const bars = [42, 58, 38, 66, 50, 72, 61]

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative h-[420px] sm:h-[480px] lg:h-[540px] [perspective:1400px]"
    >
      {/* Floating outline shapes for depth */}
      <motion.div style={{ x: shiftX, y: shiftY }} className="absolute inset-0 pointer-events-none -z-0">
        <div className="absolute top-6 left-2 w-16 h-16 rounded-2xl border border-primary-300/50 rotate-12 animate-float-slow" />
        <div className="absolute bottom-10 right-0 w-20 h-20 rounded-full border border-blue-300/50 animate-float" />
        <div className="absolute top-1/2 -right-4 w-10 h-10 rounded-xl bg-primary-200/30 animate-float" style={{ animationDelay: '1.2s' }} />
      </motion.div>

      {/* Main dashboard card */}
      <motion.div
        style={{ rotateX, rotateY, x: shiftX, y: shiftY, transformStyle: 'preserve-3d' }}
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-1/2 top-8 -translate-x-1/2 w-[88%] sm:w-[420px] rounded-3xl bg-white border border-white/60 shadow-glow-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-primary-600 to-primary-700">
          <div className="flex items-center gap-2 text-white">
            <span className="text-lg">🐝</span>
            <span className="text-sm font-display font-bold">Your Wellness Dashboard</span>
          </div>
          <div className="flex items-center gap-1 bg-white/15 rounded-full px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse-soft" />
            <span className="text-[10px] font-semibold text-white">LIVE</span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <path d="M18 2 a16 16 0 1 1 0 32 a16 16 0 1 1 0 -32" fill="none" stroke="#eef0ff" strokeWidth="3.5" />
                <motion.path
                  d="M18 2 a16 16 0 1 1 0 32 a16 16 0 1 1 0 -32"
                  fill="none" stroke="#5c5ce8" strokeWidth="3.5" strokeLinecap="round"
                  strokeDasharray="100" initial={{ strokeDashoffset: 100 }} animate={{ strokeDashoffset: 22 }}
                  transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-primary-700 text-sm">78</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Wellness Score</div>
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold mt-0.5">
                <TrendingUp size={12} /> +12% this week
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3.5">
            <div className="text-xs text-slate-400 font-medium mb-2.5">Weekly stress trend</div>
            <div className="flex items-end gap-1.5 h-16">
              {bars.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.9 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-md"
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
            <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
            <span className="text-xs text-emerald-700 font-medium">Low risk — everything looks stable</span>
          </div>
        </div>
      </motion.div>

      {/* Floating chat bubble card */}
      <motion.div
        style={{ x: shiftX, y: shiftY }}
        initial={{ opacity: 0, x: -30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 bottom-2 w-60 rounded-2xl glass shadow-glow p-4 animate-float"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs">🐝</div>
          <span className="text-xs font-semibold text-slate-700">BuddyBee</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          "Let's break your exam prep into small steps — want to try a 2-minute breathing reset first?" 🌿
        </p>
      </motion.div>

      {/* Floating alert chip */}
      <motion.div
        style={{ x: shiftX, y: shiftY }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-0 sm:-right-4 bottom-24 sm:bottom-32 bg-white rounded-2xl shadow-glow px-4 py-3 flex items-center gap-2.5 animate-float"
        style={{ animationDelay: '1.5s' }}
      >
        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
          <Bell size={14} className="text-primary-600" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-800">24/7 Support</div>
          <div className="text-[10px] text-slate-400">Always here to listen</div>
        </div>
      </motion.div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Feature bento grid
──────────────────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: MessageSquare, title: 'AI Chat Support',
    desc: '24/7 empathetic AI conversations that help students process stress the moment it happens — not the next morning.',
    span: 'lg:col-span-2 lg:row-span-2', big: true, color: 'from-primary-500 to-primary-700',
  },
  { icon: HeartPulse, title: 'Mood Tracking', desc: 'Daily check-ins turn feelings into trends counselors can actually act on.', color: 'bg-rose-50 text-rose-600' },
  { icon: AlertTriangle, title: 'Risk Detection', desc: 'NLP flags signs of anxiety or crisis in real time — before it escalates.', color: 'bg-amber-50 text-amber-600' },
  { icon: UserCog, title: 'Counselor Dashboard', desc: 'One view of every student who needs attention, ranked by urgency.', color: 'bg-purple-50 text-purple-600' },
  { icon: BarChart2, title: 'School Analytics', desc: 'Campus-wide wellness trends without exposing a single private message.', color: 'bg-blue-50 text-blue-600' },
  { icon: Bell, title: 'Crisis Alerts', desc: 'Instant, automatic escalation to a human the moment risk is detected.', color: 'bg-red-50 text-red-600' },
  { icon: FileText, title: 'Weekly Reports', desc: 'Clear, exportable summaries for counselors, admins, and care teams.', color: 'bg-emerald-50 text-emerald-600' },
  { icon: Users, title: 'Parent Dashboard', desc: 'Aggregated insight for families, privacy-first by design.', color: 'bg-orange-50 text-orange-600', soon: true },
]

function FeatureCard({ f, i }) {
  const Icon = f.icon
  if (f.big) {
    return (
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} custom={i} className={f.span}>
        <Spotlight className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-primary-600 via-primary-600 to-primary-800 text-white p-8 flex flex-col justify-between shadow-glow-lg min-h-[280px]">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div>
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
              <Icon size={22} />
            </div>
            <h3 className="font-display font-bold text-2xl mb-3">{f.title}</h3>
            <p className="text-primary-100 leading-relaxed max-w-sm">{f.desc}</p>
          </div>
          <Link to="/demo" className="relative inline-flex items-center gap-1.5 text-sm font-semibold mt-6 group w-fit">
            Try it live
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </Spotlight>
      </motion.div>
    )
  }
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} custom={i} className={f.span}>
      <Spotlight className="relative h-full card card-hover rounded-3xl group">
        {f.soon && (
          <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-500 px-2 py-1 rounded-full">Coming Soon</span>
        )}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${f.color}`}>
          <Icon size={19} />
        </div>
        <h3 className="font-display font-bold text-base text-slate-900 mb-1.5">{f.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
      </Spotlight>
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   How it works — animated AI workflow visualization
──────────────────────────────────────────────────────────────────────── */
const STEPS = [
  { title: 'Student opens a chat', desc: 'Any time, day or night, a student starts a conversation with BuddyBee.', icon: MessageSquare, tag: '"I have 3 exams this week..."' },
  { title: 'AI understands emotion', desc: 'Clinically-informed NLP reads sentiment, tone, and stress signals as they type.', icon: Brain, tag: 'sentiment: stressed' },
  { title: 'Mood tracking begins', desc: 'Every check-in quietly builds a picture of the student\'s wellbeing over time.', icon: HeartPulse, tag: 'trend: 5-day log' },
  { title: 'Insights are generated', desc: 'Trends are turned into clear, actionable signals — never raw transcripts.', icon: Activity, tag: 'risk score: medium' },
  { title: 'A counselor is notified', desc: 'If risk is detected, a real human is alerted immediately for support.', icon: Shield, tag: 'alert sent ✓' },
]

function HowItWorks() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto bg-white/92 backdrop-blur-sm rounded-[2.5rem] border border-white/70 shadow-2xl p-6 sm:p-10 md:p-14 overflow-hidden">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} className="text-center mb-20">
          <div className="section-label mb-5">AI Workflow</div>
          <h2 className="section-title mb-4">How BuddyBee Works</h2>
          <p className="section-subtitle mx-auto">Five quiet steps between a hard moment and the right kind of help. Here's what happens, end to end.</p>
        </motion.div>

        <div className="relative grid md:grid-cols-5 gap-10 md:gap-4">
          {/* connecting line + traveling pulse */}
          <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-px bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 overflow-visible">
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary-500 shadow-primary"
              initial={{ left: '0%' }}
              animate={{ left: '100%' }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', repeatDelay: 0.4 }}
            />
          </div>
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} custom={i}
              className="relative text-center"
            >
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center mx-auto mb-5 shadow-primary">
                <s.icon size={20} />
              </div>
              <div className="text-xs font-bold text-primary-500 mb-1">STEP {i + 1}</div>
              <h3 className="font-display font-bold text-slate-900 mb-2 text-sm">{s.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-3">{s.desc}</p>
              <span className="inline-block text-[10px] font-mono text-primary-600 bg-primary-50 border border-primary-100 rounded-full px-2.5 py-1">
                {s.tag}
              </span>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 mt-10">Example conversation shown for illustration — no real student data.</p>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Product showcase — interactive, tabbed, clearly-labeled sample data
──────────────────────────────────────────────────────────────────────── */
const SHOWCASE_TABS = [
  { key: 'student', label: 'Student View', icon: MessageSquare },
  { key: 'counselor', label: 'Counselor View', icon: UserCog },
  { key: 'admin', label: 'Admin View', icon: BarChart2 },
]

function SampleTag() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
      <Lock size={9} /> Sample data — for illustration only
    </span>
  )
}

function StudentPreview() {
  const bars = [55, 40, 62, 48, 70, 58, 66]
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="font-display font-bold text-slate-900">How are you feeling today?</div>
          <div className="text-xs text-slate-400">Daily check-in</div>
        </div>
        <SampleTag />
      </div>
      <div className="flex gap-2 mb-5">
        {['😊', '🙂', '😐', '😔', '😰'].map((e, i) => (
          <motion.div
            key={e}
            initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className={`flex-1 aspect-square rounded-xl flex items-center justify-center text-xl border ${i === 1 ? 'bg-primary-50 border-primary-300' : 'bg-slate-50 border-slate-100'}`}
          >
            {e}
          </motion.div>
        ))}
      </div>
      <div className="bg-slate-50 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-2.5 mb-3">
          <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs flex-shrink-0">🐝</div>
          <p className="text-xs text-slate-600 leading-relaxed">Good to see you checking in! Your mood's been steadier this week — want to keep the streak going with a 2-minute breathing reset?</p>
        </div>
      </div>
      <div className="bg-slate-50 rounded-xl p-4">
        <div className="text-xs font-semibold text-slate-500 mb-3">7-day mood trend</div>
        <div className="flex items-end gap-1.5 h-14">
          {bars.map((h, i) => (
            <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }} className="flex-1 bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-md" />
          ))}
        </div>
      </div>
    </div>
  )
}

function CounselorPreview() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="font-display font-bold text-slate-900">Counselor Overview</div>
          <div className="text-xs text-slate-400">Illustrative preview</div>
        </div>
        <SampleTag />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Students', value: '—', color: 'text-primary-600' },
          { label: 'High Risk', value: '—', color: 'text-rose-600' },
          { label: 'Avg Wellness', value: '—', color: 'text-emerald-600' },
          { label: 'Chats Today', value: '—', color: 'text-blue-600' },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-slate-50 rounded-xl p-3">
            <div className={`font-display font-bold text-lg ${m.color}`}>{m.value}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{m.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-xl p-4">
        <div className="text-xs font-semibold text-slate-500 mb-3">Risk distribution — example shape</div>
        <div className="flex h-2.5 rounded-full overflow-hidden bg-white">
          <motion.div initial={{ width: 0 }} whileInView={{ width: '68%' }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="bg-emerald-400" />
          <motion.div initial={{ width: 0 }} whileInView={{ width: '24%' }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} className="bg-amber-400" />
          <motion.div initial={{ width: 0 }} whileInView={{ width: '8%' }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="bg-rose-400" />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-2">
          <span>Low</span><span>Medium</span><span>High</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2.5">
        <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
        <span className="text-xs text-amber-700">Example alert — "Student flagged for elevated stress signals"</span>
      </div>
    </div>
  )
}

function AdminPreview() {
  const grades = [
    { label: '9th', value: 74 },
    { label: '10th', value: 58 },
    { label: '11th', value: 81 },
    { label: '12th', value: 69 },
  ]
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="font-display font-bold text-slate-900">School-wide Analytics</div>
          <div className="text-xs text-slate-400">Illustrative preview</div>
        </div>
        <SampleTag />
      </div>
      <div className="bg-slate-50 rounded-xl p-4 mb-4">
        <div className="text-xs font-semibold text-slate-500 mb-3">Engagement by grade — example pattern</div>
        <div className="space-y-2.5">
          {grades.map((g, i) => (
            <div key={g.label} className="flex items-center gap-3">
              <span className="text-xs text-slate-500 w-10">{g.label}</span>
              <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} whileInView={{ width: `${g.value}%` }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }} className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" />
              </div>
              <span className="text-xs font-semibold text-slate-600 w-8 text-right">{g.value}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-xl p-3.5 flex items-center gap-2.5">
          <GraduationCap size={16} className="text-primary-500 flex-shrink-0" />
          <span className="text-xs text-slate-600">Branch &amp; counselor management</span>
        </div>
        <div className="bg-slate-50 rounded-xl p-3.5 flex items-center gap-2.5">
          <Lock size={16} className="text-primary-500 flex-shrink-0" />
          <span className="text-xs text-slate-600">Aggregated, privacy-safe reporting</span>
        </div>
      </div>
    </div>
  )
}

const SHOWCASE_SIDEBAR = {
  student:   [{ icon: HeartPulse, label: 'Wellness', active: true }, { icon: MessageSquare, label: 'Chat' }, { icon: Activity, label: 'Progress' }, { icon: FileText, label: 'Reports' }],
  counselor: [{ icon: BarChart2, label: 'Overview', active: true }, { icon: Users, label: 'Students' }, { icon: AlertTriangle, label: 'Alerts' }, { icon: MessageSquare, label: 'Chat' }],
  admin:     [{ icon: BarChart2, label: 'Analytics', active: true }, { icon: GraduationCap, label: 'Branches' }, { icon: UserCog, label: 'Counselors' }, { icon: FileText, label: 'Reports' }],
}

function ProductShowcase() {
  const [tab, setTab] = useState('student')
  const sidebarItems = SHOWCASE_SIDEBAR[tab]

  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto bg-white/92 backdrop-blur-sm rounded-[2.5rem] border border-white/70 shadow-2xl p-6 sm:p-10 md:p-14">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} className="text-center mb-10 max-w-2xl mx-auto">
          <div className="section-label mb-5">Inside BuddyBee</div>
          <h2 className="section-title mb-4">One platform, every point of view</h2>
          <p className="section-subtitle mx-auto">Students get a companion. Counselors get clarity. Admins get the full picture — all from the same data, none of it exposed. Click around below.</p>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex gap-1 bg-slate-100 rounded-full p-1.5">
            {SHOWCASE_TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${tab === t.key ? 'text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {tab === t.key && (
                  <motion.span layoutId="showcase-pill" transition={{ type: 'spring', stiffness: 500, damping: 35 }} className="absolute inset-0 bg-white rounded-full shadow-soft -z-10" />
                )}
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[2rem] bg-gradient-to-br from-slate-50 to-primary-50/60 border border-slate-100 p-4 sm:p-8"
        >
          <div className="grid lg:grid-cols-[220px_1fr] gap-5">
            {/* Mock sidebar — swaps with active tab */}
            <div className="hidden lg:flex flex-col gap-1.5 bg-white rounded-2xl border border-slate-100 p-4 shadow-soft">
              <div className="flex items-center gap-2 mb-4 px-2">
                <span className="text-lg">🐝</span>
                <span className="font-display font-bold text-sm">BuddyBee</span>
              </div>
              <AnimatePresence>
                <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-1.5">
                  {sidebarItems.map(({ icon: Icon, label, active }) => (
                    <div key={label} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium ${active ? 'bg-primary-50 text-primary-700' : 'text-slate-500'}`}>
                      <Icon size={14} /> {label}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mock main panel — swaps with active tab */}
            <AnimatePresence>
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {tab === 'student' && <StudentPreview />}
                {tab === 'counselor' && <CounselorPreview />}
                {tab === 'admin' && <AdminPreview />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Floating chip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="hidden sm:flex absolute -bottom-6 right-10 items-center gap-2 bg-white rounded-2xl shadow-glow-lg px-4 py-3 animate-float"
          >
            <Shield size={16} className="text-primary-600" />
            <span className="text-xs font-semibold text-slate-700">FERPA &amp; HIPAA compliant</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Page
──────────────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <SEO
        path="/"
        title="AI-Powered Student Wellness Companion"
        description="BuddyBee AI helps schools detect student stress early, provide 24/7 empathetic AI chat support, and give counselors real-time wellbeing insights."
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 overflow-hidden">
        <div className="absolute inset-0 grid-bg mask-fade-b -z-20" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <motion.div variants={fadeUp} custom={0} className="section-label mb-6">
              <Sparkles size={12} /> AI-Powered Student Wellness
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="font-display text-5xl md:text-6xl font-bold text-slate-900 leading-[1.05] mb-6 text-balance">
              Helping students build{' '}
              <span className="gradient-text">better mental wellbeing</span>{' '}
              with AI
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-xl text-slate-500 leading-relaxed mb-10 max-w-lg">
              BuddyBee gives every student a caring AI companion, and every school a real-time window into wellbeing — without ever compromising privacy.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4 mb-10">
              <Link to="/contact" className="btn-primary text-base group">
                Request School Demo
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link to="/demo" className="btn-secondary text-base">
                See How It Works
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} custom={4} className="flex items-center gap-3 flex-wrap">
              {[
                { icon: Lock, label: 'FERPA & HIPAA compliant' },
                { icon: CheckCircle2, label: '24/7 AI availability' },
                { icon: Shield, label: 'Real human escalation' },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-100 rounded-full px-3 py-1.5 shadow-soft">
                  <Icon size={12} className="text-primary-500" /> {label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <HeroVisual />
        </div>
      </section>

      {/* Features bento grid */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto bg-white/92 backdrop-blur-sm rounded-[2.5rem] border border-white/70 shadow-2xl p-6 sm:p-10 md:p-14">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} className="text-center mb-16 max-w-2xl mx-auto">
            <div className="section-label mb-5">Everything schools need</div>
            <h2 className="section-title mb-4">Built for students. Trusted by schools.</h2>
            <p className="section-subtitle mx-auto">One platform covering the full loop — from a student's first message to a counselor's next move.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-5">
            {FEATURES.map((f, i) => <FeatureCard key={f.title} f={f} i={i} />)}
          </div>
        </div>
      </section>

      <ProductShowcase />
      <HowItWorks />

      {/* Final CTA */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-primary-600 via-primary-600 to-primary-800 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 grid-bg opacity-[0.06] -z-0" />
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
          className="relative max-w-3xl mx-auto text-center"
        >
          <BeeMascot size="lg" animate className="mb-6" />
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
            Ready to transform student wellness?
          </h2>
          <p className="text-primary-100 text-lg mb-10 max-w-xl mx-auto">
            Bring BuddyBee AI to your school and give every student a companion who's always listening — and every counselor a clearer signal of who needs support.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="bg-white text-primary-700 font-semibold px-8 py-3.5 rounded-full hover:bg-primary-50 hover:-translate-y-0.5 transition-all duration-300 shadow-lg">
              Schedule a Demo
            </Link>
            <Link to="/contact" className="border-2 border-white/40 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300">
              Contact Sales
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
