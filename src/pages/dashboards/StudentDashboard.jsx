import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  HeartPulse, Brain, MessageSquare, Zap,
  Send, TrendingUp, Target, BookOpen, Lightbulb
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
  WellnessRadarChart
} from '../../components/Charts'

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
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-5 rounded-2xl">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={16} className="text-indigo-500" />
        <h3 className="font-bold text-slate-800 text-sm">AI Recommendations</h3>
      </div>
      <ul className="space-y-2">
        {list.map((tip, i) => (
          <li key={i} className="text-sm text-slate-700 leading-relaxed">{tip}</li>
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
    <div className="bg-white border p-5 rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Target size={16} className="text-emerald-500" />
        <h3 className="font-bold text-slate-800 text-sm">Quick Study Planner</h3>
      </div>
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Subject</label>
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            {[15, 25, 30, 45, 60, 90].map(m => <option key={m} value={m}>{m} min</option>)}
          </select>
        </div>
        <button
          onClick={save}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition-colors"
        >
          {saved ? '✅ Saved!' : '+ Add Session'}
        </button>
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
    <div className="bg-white border p-5 rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-purple-500" />
        <h3 className="font-bold text-slate-800 text-sm">Your Progress</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {milestones.map((m) => (
          <div
            key={m.label}
            className={`p-3 rounded-xl text-center transition-all ${
              m.reached
                ? 'bg-indigo-50 border border-indigo-200'
                : 'bg-slate-50 border border-slate-100 opacity-40'
            }`}
          >
            <div className="text-xl mb-1">{m.icon}</div>
            <div className={`text-xs font-medium ${m.reached ? 'text-indigo-700' : 'text-slate-400'}`}>
              {m.label}
            </div>
          </div>
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
      <div className="flex items-center justify-center h-full p-10">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">🐝</div>
          <p className="text-slate-500 text-sm" style={textStyle}>{T('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <div className="text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-slate-500 text-sm mb-4" style={textStyle}>{error}</p>
          <button onClick={fetchDashboard} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition-colors">
            {T('common.back')}
          </button>
        </div>
      </div>
    )
  }

  const riskLevel = dashboard?.riskLevel ?? 'low'
  const wellness  = dashboard?.wellnessScore ?? 0
  const aiChats   = dashboard?.aiChats ?? 0
  const streak    = dashboard?.streak ?? 0

  return (
    <div className="p-5 max-w-7xl mx-auto space-y-5">
      {isUrdu && (
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap');`}</style>
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl text-white"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1" style={isUrdu ? { direction: 'rtl', textAlign: 'right' } : {}}>
            <p className="text-sm text-blue-100" style={isUrdu ? { fontFamily: urduFont } : {}}>
              {greeting()}, {user?.name || 'Student'}
            </p>
            <h1 className="text-2xl font-bold" style={isUrdu ? { fontFamily: urduFont } : {}}>
              {T('student.dashboardTitle')}
            </h1>
            <p className="text-sm mt-2 text-blue-100" style={isUrdu ? { fontFamily: urduFont } : {}}>
              {T('student.wellnessScore')}:{' '}
              <span className="text-white font-bold">{wellness}/100</span>
              {streak > 0 && <span className="ml-3">🔥 {streak}-day streak</span>}
            </p>
            <Link
              to="/dashboard/chat"
              className="inline-block mt-4 bg-white text-indigo-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-50 transition-colors"
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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title={T('student.wellnessScore')} value={wellness}                    icon={HeartPulse}    color="blue"   />
        <StatsCard title={T('student.stressLevel')}   value={dashboard?.stressLevel ?? '-'} icon={Brain}         color="orange" />
        <StatsCard title={T('student.aiChats')}       value={aiChats}                     icon={MessageSquare} color="purple" />
        <StatsCard title={T('student.streak')}        value={`${streak}`}                 icon={Zap}           color="green"  />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-0">
        {[
          { key: 'overview',  label: 'Overview',    icon: HeartPulse },
          { key: 'progress',  label: 'Progress',    icon: TrendingUp },
          { key: 'planner',   label: 'Study Planner', icon: BookOpen },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors
              ${activeTab === t.key
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50'
                : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <SchoolAssociation />

          {/* Mood Check */}
          <div className="bg-white p-5 rounded-2xl border">
            <div className="flex items-center justify-between mb-3" style={isUrdu ? { flexDirection: 'row-reverse' } : {}}>
              <h3 className="font-bold text-slate-900" style={isUrdu ? { fontFamily: urduFont } : {}}>
                {T('student.howAreYou')}
              </h3>
              <div className="flex items-center gap-2">
                {moodSaved && <span className="text-xs text-green-600 font-medium">{T('student.moodUpdated')}</span>}
                {moodLoading && <span className="text-xs text-indigo-400">...</span>}
              </div>
            </div>
            <div className="flex gap-3 flex-wrap" style={isUrdu ? { flexDirection: 'row-reverse' } : {}}>
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMood(mood.value)}
                  disabled={moodLoading}
                  className={`p-3 border rounded-xl transition-all text-center min-w-[64px]
                    ${selectedMood === mood.value ? 'bg-indigo-50 border-indigo-400 scale-105 shadow-sm' : 'hover:border-slate-300 hover:bg-slate-50'}
                    ${moodLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <div className="text-xl">{mood.emoji}</div>
                  <div className="text-xs text-slate-600 mt-1" style={isUrdu ? { fontFamily: urduFont, fontSize: '11px' } : {}}>
                    {mood.label}
                  </div>
                </button>
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
          <WellnessRadarChart data={dashboard?.wellnessBreakdown ?? []} />
        </motion.div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <ProgressTracker wellness={wellness} aiChats={aiChats} streak={streak} />

          {/* Emotional trend summary */}
          <div className="bg-white border p-5 rounded-2xl">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Emotional Trend (7 Days)</h3>
            <MoodAreaChart data={dashboard?.moodHistory ?? []} />
          </div>

          <div className="bg-white border p-5 rounded-2xl">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Stress Pattern (7 Days)</h3>
            <WeeklyStressChart data={dashboard?.stressTrend ?? []} />
          </div>

          <WellnessRadarChart data={dashboard?.wellnessBreakdown ?? []} />
        </motion.div>
      )}

      {/* Planner Tab */}
      {activeTab === 'planner' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <StudyPlannerWidget />

          {/* Talk to BuddyBee */}
          <div className="bg-white p-5 rounded-2xl border">
            <h3 className="font-bold mb-3 text-slate-900" style={textStyle}>
              {T('student.talkToBuddyBee')}
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 border" style={textStyle}>
              {T('student.chatSubtitle')}
            </div>
            <Link
              to="/dashboard/chat"
              className="mt-3 inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Send size={14} />
              {T('student.startChat')}
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}

