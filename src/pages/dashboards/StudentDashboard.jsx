import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  HeartPulse, Brain, MessageSquare, Zap,
  Send, TrendingUp, Target, BookOpen, Lightbulb, Sparkles, Flame
} from 'lucide-react'

import api from '../../api'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import { getT } from '../../translations'

import StatsCard from '../../components/StatsCard'
import RiskIndicator from '../../components/RiskIndicator'
import SchoolAssociation from '../../components/SchoolAssociation'
import LanguageSwitcher from '../../components/LanguageSwitcher'

import {
  MoodAreaChart,
  WeeklyStressChart,
  WellnessRadarChart,
  EmotionDistributionChart,
  ConversationActivityChart,
  CheckinHistoryChart
} from '../../components/Charts'
import DailyReport from '../../components/DailyReport'

// ── AI Recommendation card ────────────────────────────────────────────────────
function AIRecommendation({ riskLevel, wellness, aiChats }) {
  const tips = {
    high: [
      "🫂 Please talk to your school counsellor — you don't have to handle this alone.",
      "📞 Reach out to a trusted adult today.",
      "💙 BuddyBee is here — start a chat whenever you're ready.",
    ],
    medium: [
      "🧘 Try a 5-minute breathing exercise before your next study session.",
      "📓 Journalling for 10 minutes a day can help reduce stress significantly.",
      "💬 Chat with BuddyBee to talk through what's on your mind.",
    ],
    low: [
      "🌟 You're doing great — keep up the streak!",
      wellness < 60
        ? "💤 Your wellness score suggests you may need more rest."
        : "📚 Great time to tackle a challenging topic while you're feeling good.",
      aiChats === 0
        ? "🐝 Haven't chatted yet? BuddyBee is ready to help with anything."
        : "🔥 Keep the momentum — consistency is key.",
    ],
  }
  const list = tips[riskLevel] || tips.low

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-blue-50 border border-primary-100 p-5 rounded-2xl">
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary-200/40 rounded-full blur-2xl" />
      <div className="relative flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center">
          <Lightbulb size={14} className="text-primary-600" />
        </div>
        <h3 className="font-display font-bold text-slate-800 text-sm">AI Recommendations</h3>
      </div>
      <ul className="relative space-y-2">
        {list.map((tip, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="text-sm text-slate-700 leading-relaxed"
          >{tip}</motion.li>
        ))}
      </ul>
    </div>
  )
}

// ── Study Planner quick widget ────────────────────────────────────────────────
function StudyPlannerWidget() {
  const SUBJECTS = ['Math', 'Science', 'English', 'History', 'Other']
  const [subject, setSubject] = useState('')
  const [duration, setDuration] = useState(30)
  const [saved, setSaved] = useState(false)

  const save = () => {
    if (!subject) return
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
          <Target size={14} className="text-emerald-500" />
        </div>
        <h3 className="font-display font-bold text-slate-800 text-sm">Quick Study Planner</h3>
      </div>
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Subject</label>
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all"
          >
            <option value="">Select...</option>
            {SUBJECTS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Duration</label>
          <select
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all"
          >
            {[15, 25, 30, 45, 60, 90].map(m => <option key={m} value={m}>{m} min</option>)}
          </select>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={save}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 hover:-translate-y-0.5 transition-all duration-200 shadow-primary"
        >
          {saved ? '✅ Saved!' : '+ Add Session'}
        </motion.button>
      </div>
      <p className="text-xs text-slate-400 mt-3">
        💡 Tip: 25-minute focused sessions (Pomodoro) are scientifically proven to improve retention.
      </p>
    </div>
  )
}

// ── Progress Tracker ──────────────────────────────────────────────────────────
function ProgressTracker({ wellness, aiChats, streak }) {
  const milestones = [
    { label: 'First Chat',     reached: aiChats >= 1,  icon: '💬' },
    { label: '3-Day Streak',   reached: streak >= 3,   icon: '🔥' },
    { label: 'Wellness 70+',   reached: wellness >= 70, icon: '💚' },
    { label: '10 Chats',       reached: aiChats >= 10, icon: '🏆' },
    { label: '7-Day Streak',   reached: streak >= 7,   icon: '⭐' },
    { label: 'Wellness 90+',   reached: wellness >= 90, icon: '🌟' },
  ]

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
          <TrendingUp size={14} className="text-purple-500" />
        </div>
        <h3 className="font-display font-bold text-slate-800 text-sm">Your Progress</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {milestones.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={m.reached ? { y: -2, scale: 1.03 } : undefined}
            className={`p-3 rounded-xl text-center transition-all duration-200 ${
              m.reached
                ? 'bg-primary-50 border border-primary-200 shadow-sm'
                : 'bg-slate-50 border border-slate-100 opacity-40'
            }`}
          >
            <div className="text-xl mb-1">{m.icon}</div>
            <div className={`text-xs font-medium ${m.reached ? 'text-primary-700' : 'text-slate-400'}`}>
              {m.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const { user } = useAuth()
  const { lang } = useLang()
  const T = getT(lang)

  const isUrdu = lang === 'ur'
  const urduFont = "'Noto Nastaliq Urdu', serif"

  const MOOD_OPTIONS = [
    { emoji: '😊', label: T('student.mood_great'),   value: 5 },
    { emoji: '🙂', label: T('student.mood_good'),    value: 4 },
    { emoji: '😐', label: T('student.mood_okay'),    value: 3 },
    { emoji: '😔', label: T('student.mood_low'),     value: 2 },
    { emoji: '😰', label: T('student.mood_anxious'), value: 1 },
  ]

  const [dashboard,    setDashboard]    = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [selectedMood, setSelectedMood] = useState(null)
  const [moodLoading,  setMoodLoading]  = useState(false)
  const [moodSaved,    setMoodSaved]    = useState(false)
  const [error,        setError]        = useState(null)
  const [activeTab,    setActiveTab]    = useState('overview')

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/api/student/dashboard')
      setDashboard(res.data)
    } catch (err) {
      if (err.response?.status !== 401) setError(T('common.error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDashboard() }, [])

  const handleMood = async (value) => {
    if (moodLoading) return
    setSelectedMood(value)
    setMoodLoading(true)
    setMoodSaved(false)
    try {
      await api.post('/api/student/mood', { mood: value })
      await fetchDashboard()
      setMoodSaved(true)
      setTimeout(() => setMoodSaved(false), 3000)
    } catch (err) {
      console.error('Mood update error:', err)
    } finally {
      setMoodLoading(false)
    }
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return T('student.greeting_morning')
    if (h < 17) return T('student.greeting_afternoon')
    return T('student.greeting_evening')
  }

  const textStyle = isUrdu ? { fontFamily: urduFont, direction: 'rtl', textAlign: 'right' } : {}

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-10">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce-soft">🐝</div>
          <p className="text-slate-500 text-sm" style={textStyle}>{T('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-10">
        <div className="text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-slate-500 text-sm mb-4" style={textStyle}>{error}</p>
          <button onClick={fetchDashboard} className="px-4 py-2 bg-primary-600 text-white text-sm rounded-xl hover:bg-primary-700 transition-colors">
            {T('common.back')}
          </button>
        </div>
      </div>
    )
  }

  const riskLevel = dashboard?.riskLevel ?? 'pending'
  const wellness  = dashboard?.wellnessScore ?? 0
  const aiChats   = dashboard?.aiChats ?? 0
  const streak    = dashboard?.streak ?? 0
  const hasActivity = dashboard?.hasActivity ?? false

  const TABS = [
    { key: 'overview',  label: 'Overview',    icon: HeartPulse },
    { key: 'report',    label: 'Daily Report', icon: Target },
    { key: 'progress',  label: 'Progress',    icon: TrendingUp },
    { key: 'planner',   label: 'Study Planner', icon: BookOpen },
  ]

  return (
    <div className="p-2 sm:p-3 max-w-7xl mx-auto space-y-5">
      {isUrdu && (
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap');`}</style>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-600 to-blue-700 p-6 rounded-2xl text-white shadow-glow-lg"
      >
        <div className="absolute -top-16 -right-10 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 left-1/3 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1" style={isUrdu ? { direction: 'rtl', textAlign: 'right' } : {}}>
            <p className="text-sm text-primary-100 flex items-center gap-1.5" style={isUrdu ? { fontFamily: urduFont } : {}}>
              <Sparkles size={13} /> {greeting()}, {user?.name || 'Student'}
            </p>
            <h1 className="font-display text-2xl font-bold mt-1" style={isUrdu ? { fontFamily: urduFont } : {}}>
              {T('student.dashboardTitle')}
            </h1>
            <p className="text-sm mt-2 text-primary-100 flex items-center flex-wrap gap-3" style={isUrdu ? { fontFamily: urduFont } : {}}>
              <span>{T('student.wellnessScore')}: <span className="text-white font-bold">{hasActivity ? `${wellness}/100` : 'Not Available'}</span></span>
              {streak > 0 && (
                <span className="inline-flex items-center gap-1 bg-white/15 rounded-full px-2.5 py-0.5">
                  <Flame size={12} /> {streak}-day streak
                </span>
              )}
            </p>
            <Link
              to="/dashboard/chat"
              className="inline-flex items-center gap-1.5 mt-4 bg-white text-primary-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-50 hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
              style={isUrdu ? { fontFamily: urduFont } : {}}
            >
              {T('student.startChat')}
            </Link>
          </div>
          <div className="flex-shrink-0 mt-1">
            <LanguageSwitcher />
          </div>
        </div>
      </motion.div>

      {/* Onboarding card for brand-new students */}
      {!hasActivity && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl animate-float">🐝</div>
            <div>
              <h3 className="font-display font-bold text-slate-800 text-sm">Welcome to BuddyBee AI!</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Complete your first mood check-in or AI conversation to generate your personalized
                wellness insights. Until then, your analytics will show "Not Available" — we never
                display estimated or placeholder data.
              </p>
              <Link
                to="/dashboard/chat"
                className="inline-flex items-center gap-2 mt-3 bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-amber-600 hover:-translate-y-0.5 transition-all duration-200"
              >
                <MessageSquare size={14} /> Start Your First Conversation
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title={T('student.wellnessScore')} value={hasActivity ? wellness : 'N/A'}     icon={HeartPulse}    color="blue"   delay={0} />
        <StatsCard title={T('student.stressLevel')}   value={hasActivity ? (dashboard?.stressLevel ?? '-') : 'N/A'} icon={Brain} color="orange" delay={0.05} />
        <StatsCard title={T('student.aiChats')}       value={aiChats}                            icon={MessageSquare} color="purple" delay={0.1} />
        <StatsCard title={T('student.streak')}        value={`${streak}`}                        icon={Zap}           color="green"  delay={0.15} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 pb-0 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors whitespace-nowrap
              ${activeTab === t.key ? 'text-primary-700' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <t.icon size={13} />
            {t.label}
            {activeTab === t.key && (
              <motion.span
                layoutId="student-tab-underline"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary-600 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            <SchoolAssociation />

            {/* Mood Check */}
            <div className="card">
              <div className="flex items-center justify-between mb-3" style={isUrdu ? { flexDirection: 'row-reverse' } : {}}>
                <h3 className="font-display font-bold text-slate-900" style={isUrdu ? { fontFamily: urduFont } : {}}>
                  {T('student.howAreYou')}
                </h3>
                <div className="flex items-center gap-2">
                  <AnimatePresence>
                    {moodSaved && (
                      <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-xs text-emerald-600 font-medium">
                        {T('student.moodUpdated')}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {moodLoading && <span className="text-xs text-primary-400">...</span>}
                </div>
              </div>
              <div className="flex gap-3 flex-wrap" style={isUrdu ? { flexDirection: 'row-reverse' } : {}}>
                {MOOD_OPTIONS.map((mood) => (
                  <motion.button
                    key={mood.value}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMood(mood.value)}
                    disabled={moodLoading}
                    className={`p-3 border rounded-xl transition-all text-center min-w-[64px]
                      ${selectedMood === mood.value ? 'bg-primary-50 border-primary-400 shadow-glow' : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'}
                      ${moodLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="text-xl">{mood.emoji}</div>
                    <div className="text-xs text-slate-600 mt-1" style={isUrdu ? { fontFamily: urduFont, fontSize: '11px' } : {}}>
                      {mood.label}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <RiskIndicator
              level={riskLevel}
              score={dashboard?.riskScore ?? 0}
              context={dashboard?.riskContext ?? 'Student Wellness Assessment'}
            />

            {/* AI Recommendations */}
            <AIRecommendation riskLevel={riskLevel} wellness={wellness} aiChats={aiChats} />

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-5">
              <MoodAreaChart     data={dashboard?.moodHistory ?? []} />
              <WeeklyStressChart data={dashboard?.stressTrend ?? []} />
            </div>
            <div className="grid lg:grid-cols-2 gap-5">
              <EmotionDistributionChart data={dashboard?.emotionDistribution ?? []} />
              <ConversationActivityChart data={dashboard?.conversationActivity ?? []} />
            </div>
            <WellnessRadarChart data={dashboard?.wellnessBreakdown ?? []} />
            <CheckinHistoryChart data={dashboard?.checkinHistory ?? []} />
          </motion.div>
        )}

        {/* Daily Report Tab */}
        {activeTab === 'report' && (
          <motion.div key="report" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <DailyReport key={`report-${dashboard?.wellnessScore}-${dashboard?.aiChats}`} />
          </motion.div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <motion.div key="progress" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            <ProgressTracker wellness={wellness} aiChats={aiChats} streak={streak} />

            {/* Emotional trend summary */}
            <div className="card">
              <h3 className="font-display font-bold text-slate-800 text-sm mb-4">Emotional Trend (7 Days)</h3>
              <MoodAreaChart data={dashboard?.moodHistory ?? []} />
            </div>

            <div className="card">
              <h3 className="font-display font-bold text-slate-800 text-sm mb-4">Stress Pattern (7 Days)</h3>
              <WeeklyStressChart data={dashboard?.stressTrend ?? []} />
            </div>

            <WellnessRadarChart data={dashboard?.wellnessBreakdown ?? []} />
          </motion.div>
        )}

        {/* Planner Tab */}
        {activeTab === 'planner' && (
          <motion.div key="planner" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            <StudyPlannerWidget />

            {/* Talk to BuddyBee */}
            <div className="card">
              <h3 className="font-display font-bold mb-3 text-slate-900" style={textStyle}>
                {T('student.talkToBuddyBee')}
              </h3>
              <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 border border-slate-100" style={textStyle}>
                {T('student.chatSubtitle')}
              </div>
              <Link
                to="/dashboard/chat"
                className="mt-3 inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-700 hover:-translate-y-0.5 transition-all duration-200 shadow-primary"
              >
                <Send size={14} />
                {T('student.startChat')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
