import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeartPulse, AlertTriangle, Brain, TrendingUp, BookOpen, MessageSquare } from 'lucide-react'

import api from '../../api'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import { getT } from '../../translations'

import StatsCard from '../../components/StatsCard'
import RiskIndicator from '../../components/RiskIndicator'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { BehavioralTrendsChart, WeeklyStressChart } from '../../components/Charts'

// ── Learning Summary Card ─────────────────────────────────────────────────────
function LearningSummary({ wellness, aiChats, stress }) {
  const getInsight = () => {
    if (wellness >= 80) return { emoji: '🌟', msg: 'Your child is thriving! High wellness score indicates good emotional health.', color: 'emerald' }
    if (wellness >= 60) return { emoji: '📈', msg: 'Your child is doing reasonably well. Consistent check-ins will help maintain this.', color: 'blue' }
    return { emoji: '💛', msg: 'Your child may need extra support right now. Consider reaching out to their counsellor.', color: 'amber' }
  }

  const { emoji, msg, color } = getInsight()
  const colorMap = { emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800', blue: 'bg-blue-50 border-blue-200 text-blue-800', amber: 'bg-amber-50 border-amber-200 text-amber-800' }

  return (
    <div className={`p-5 rounded-2xl border ${colorMap[color]}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <h3 className="font-bold text-sm mb-1">Learning & Wellness Insight</h3>
          <p className="text-sm leading-relaxed">{msg}</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="bg-white/70 rounded-xl p-2 text-center">
              <div className="font-bold text-base">{wellness}</div>
              <div className="text-xs opacity-70">Wellness</div>
            </div>
            <div className="bg-white/70 rounded-xl p-2 text-center">
              <div className="font-bold text-base">{aiChats}</div>
              <div className="text-xs opacity-70">AI Chats</div>
            </div>
            <div className="bg-white/70 rounded-xl p-2 text-center">
              <div className="font-bold text-base capitalize">{stress || 'N/A'}</div>
              <div className="text-xs opacity-70">Stress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Wellness Timeline ─────────────────────────────────────────────────────────
function WellnessTimeline({ weeklyStress }) {
  if (!weeklyStress || weeklyStress.length === 0) return null
  const max = Math.max(...weeklyStress.map(d => d.value), 1)

  return (
    <div className="bg-white border p-5 rounded-2xl">
      <h3 className="font-bold text-slate-800 text-sm mb-4">Weekly Wellness Timeline</h3>
      <div className="flex items-end justify-between gap-2 h-20">
        {weeklyStress.map((d, i) => {
          const pct = Math.max(10, Math.round((d.value / max) * 100))
          const color = d.value > 60 ? 'bg-rose-400' : d.value > 30 ? 'bg-amber-400' : 'bg-emerald-400'
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-xs text-slate-500">{d.value}</span>
              <div className={`w-full rounded-t-lg ${color} transition-all duration-500`} style={{ height: `${pct}%` }} />
              <span className="text-xs text-slate-400">{d.day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function ParentDashboard() {
  const { user } = useAuth()
  const { lang } = useLang()
  const T = getT(lang)

  const isUrdu   = lang === 'ur'
  const urduFont = "'Noto Nastaliq Urdu', serif"
  const textStyle = isUrdu ? { fontFamily: urduFont, direction: 'rtl', textAlign: 'right' } : {}

  const [childData, setChildData] = useState(null)
  const [alerts,    setAlerts]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [tab,       setTab]       = useState('overview')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/parent/dashboard')
        setChildData(res.data?.child ?? null)
        setAlerts(res.data?.alerts ?? [])
      } catch (err) {
        if (err.response?.status !== 401) setError(T('common.error'))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return T('student.greeting_morning')
    if (h < 17) return T('student.greeting_afternoon')
    return T('student.greeting_evening')
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] p-10">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-bounce">🐝</div>
        <p className="text-slate-500 text-sm" style={textStyle}>{T('common.loading')}</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh] p-10">
      <div className="text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-slate-500 text-sm" style={textStyle}>{error}</p>
      </div>
    </div>
  )

  const weeklyReport = childData?.weeklyReport ?? {}
  const wellness     = childData?.wellnessScore || 0
  const aiChats      = weeklyReport?.sessions || 0

  const PARENT_LABELS = {
    monitoring:   { en: 'Monitoring', ur: 'نگرانی' },
    wellness:     { en: 'Wellness', ur: 'صحت' },
    stressLevel:  { en: 'Stress Level', ur: 'تناؤ' },
    alerts:       { en: 'Alerts', ur: 'اطلاعات' },
    sessions:     { en: 'Sessions', ur: 'سیشن' },
    noAlerts:     { en: 'No alerts', ur: 'کوئی اطلاع نہیں' },
    weeklyReport: { en: 'Weekly Report', ur: 'ہفتہ وار رپورٹ' },
    noReport:     { en: 'No weekly report available', ur: 'ہفتہ وار رپورٹ دستیاب نہیں' },
    wellnessScore: { en: 'Wellness Score', ur: 'صحت اسکور' },
  }
  const Lbl = (key) => PARENT_LABELS[key]?.[lang] || PARENT_LABELS[key]?.en || key

  return (
    <div className="p-5 max-w-7xl mx-auto space-y-5">
      {isUrdu && <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap');`}</style>}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-2xl text-white"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1" style={isUrdu ? { direction: 'rtl', textAlign: 'right' } : {}}>
            <p className="text-sm text-emerald-100" style={isUrdu ? { fontFamily: urduFont } : {}}>
              {greeting()}, {user?.name}
            </p>
            <h1 className="text-2xl font-bold mt-1" style={isUrdu ? { fontFamily: urduFont } : {}}>
              {Lbl('monitoring')}: {childData?.childName || '—'}
            </h1>
            <p className="text-sm text-emerald-100 mt-2" style={isUrdu ? { fontFamily: urduFont } : {}}>
              {Lbl('wellnessScore')}: <strong>{wellness}/100</strong>
              {childData?.riskLevel === 'high' && <span className="ml-3 bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">⚠ High Risk</span>}
            </p>
          </div>
          <div className="flex-shrink-0 mt-1"><LanguageSwitcher /></div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title={Lbl('wellness')}    value={wellness}                      icon={HeartPulse}    color="green"  />
        <StatsCard title={Lbl('stressLevel')} value={childData?.stress || '-'}      icon={Brain}         color="orange" />
        <StatsCard title={Lbl('alerts')}      value={alerts.length}                 icon={AlertTriangle} color="red"    />
        <StatsCard title={Lbl('sessions')}    value={weeklyReport?.sessions || 0}   icon={TrendingUp}    color="purple" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-0">
        {[
          { key: 'overview',  label: 'Overview',  icon: HeartPulse },
          { key: 'insights',  label: 'Insights',  icon: BookOpen },
          { key: 'alerts',    label: 'Alerts',    icon: AlertTriangle },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors
              ${tab === t.key ? 'border-emerald-600 text-emerald-700 bg-emerald-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <RiskIndicator
            level={childData?.riskLevel || 'low'}
            score={childData?.riskScore || 0}
            context="Child Risk Assessment"
          />
          <WellnessTimeline weeklyStress={childData?.weeklyStress || []} />
          <div className="grid lg:grid-cols-2 gap-5">
            <WeeklyStressChart     data={childData?.weeklyStress || []} />
            <BehavioralTrendsChart data={childData?.behavioralTrends || []} />
          </div>
        </motion.div>
      )}

      {/* Insights Tab */}
      {tab === 'insights' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <LearningSummary wellness={wellness} aiChats={aiChats} stress={childData?.stress} />

          {/* Weekly report */}
          <div className="bg-white p-5 rounded-2xl border">
            <h3 className="font-bold mb-4" style={textStyle}>{Lbl('weeklyReport')}</h3>
            {Object.keys(weeklyReport).length === 0
              ? <p className="text-sm text-slate-500" style={textStyle}>{Lbl('noReport')}</p>
              : <div className="grid grid-cols-2 gap-3">
                  {Object.entries(weeklyReport).map(([key, value]) => (
                    <div key={key} className="bg-slate-50 p-3 rounded-xl">
                      <div className="font-bold text-sm">{value}</div>
                      <div className="text-xs text-slate-500 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
            }
          </div>

          {/* Guidance for parents */}
          <div className="bg-teal-50 border border-teal-100 p-5 rounded-2xl">
            <h3 className="font-bold text-teal-800 text-sm mb-3">💡 How to Support Your Child</h3>
            <ul className="space-y-2 text-sm text-teal-700">
              <li>✅ Ask open-ended questions about their day — avoid yes/no questions.</li>
              <li>✅ Create a distraction-free study time at home, even 30 minutes daily.</li>
              <li>✅ Validate their feelings rather than immediately problem-solving.</li>
              <li>✅ If risk is medium/high, reach out to their school counsellor directly.</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Alerts Tab */}
      {tab === 'alerts' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white p-5 rounded-2xl border">
            <h3 className="font-bold mb-4" style={textStyle}>{Lbl('alerts')}</h3>
            {alerts.length === 0
              ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2">✅</div>
                  <p className="text-sm text-slate-500" style={textStyle}>{Lbl('noAlerts')}</p>
                </div>
              )
              : <div className="space-y-3">
                  {alerts.map((alert, i) => (
                    <div key={i} className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <div className="text-sm">{alert.msg}</div>
                      <div className="text-xs text-slate-400 mt-1">{alert.time}</div>
                    </div>
                  ))}
                </div>
            }
          </div>
        </motion.div>
      )}
    </div>
  )
}
