import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  HeartPulse, MessageSquare, Zap, Clock, AlertTriangle,
  TrendingUp, TrendingDown, Minus, Smile, Shield, Sparkles,
  Brain, Users, Flame, Activity, BarChart3, Type, Sun
} from 'lucide-react'
import api from '../api'
import { EmotionDistributionChart } from './Charts'

const _INSUF = 'Not enough data available'

// ── Animated progress ring ───────────────────────────────────────
function ProgressRing({ value = 0, max = 100, size = 100, strokeWidth = 8, color = '#5c5ce8' }) {
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const pct = Math.min(Math.max(value / max, 0), 1)
  const offset = circumference * (1 - pct)
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#f1f5f9" strokeWidth={strokeWidth} />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }} />
    </svg>
  )
}

// ── Stat tile ─────────────────────────────────────────────────────
const BG = {
  indigo:'bg-indigo-50 text-indigo-600', emerald:'bg-emerald-50 text-emerald-600',
  amber:'bg-amber-50 text-amber-600', rose:'bg-rose-50 text-rose-600',
  blue:'bg-blue-50 text-blue-600', purple:'bg-purple-50 text-purple-600',
  teal:'bg-teal-50 text-teal-600', slate:'bg-slate-100 text-slate-600',
}
function Stat({ icon: Icon, label, value, sub, color = 'indigo', delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${BG[color]}`}>
        <Icon size={16} />
      </div>
      <div className="text-lg font-bold text-slate-900 leading-tight">{value ?? '—'}</div>
      <div className="text-[11px] text-slate-500 mt-0.5">{label}</div>
      {sub && <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>}
    </motion.div>
  )
}

// ── Emotion bar ───────────────────────────────────────────────────
function EmotionBar({ label, pct, color, delay = 0 }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="text-slate-500 font-bold">{pct}%</span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay }} />
      </div>
    </div>
  )
}

// ── Trend badge ───────────────────────────────────────────────────
function TrendBadge({ trend }) {
  if (trend === 'increasing') return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full">
      <TrendingUp size={12} /> Increasing
    </span>
  )
  if (trend === 'decreasing') return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
      <TrendingDown size={12} /> Decreasing
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
      <Minus size={12} /> Stable
    </span>
  )
}

// ── Improvement badge ────────────────────────────────────────────
function ImprovementBadge({ value }) {
  if (value === null || value === undefined) return (
    <span className="text-xs text-slate-400">No yesterday data</span>
  )
  if (value > 0) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
      <TrendingUp size={12} /> +{value} pts
    </span>
  )
  if (value < 0) return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
      <TrendingDown size={12} /> {value} pts
    </span>
  )
  return <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500"><Minus size={12} /> No change</span>
}

// ── Skeleton ──────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-28 bg-slate-200 rounded-2xl" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => <div key={i} className="h-28 bg-slate-100 rounded-2xl" />)}
      </div>
      <div className="h-40 bg-slate-100 rounded-2xl" />
      <div className="h-32 bg-slate-100 rounded-2xl" />
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────
export default function DailyReport() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/api/student/daily-report')
      .then(res => setReport(res.data?.report))
      .catch(() => setError('Could not load your daily report.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Skeleton />
  if (error) return (
    <div className="bg-white border rounded-2xl p-8 text-center">
      <div className="text-3xl mb-2">⚠️</div>
      <p className="text-sm text-slate-500">{error}</p>
    </div>
  )
  if (!report) return null

  const noActivity = report.chats_today === 0 && report.mood_entries_today === 0 && (report.confidence ?? 0) === 0

  const riskColor = report.risk_level === 'high' ? 'rose' :
                    report.risk_level === 'medium' ? 'amber' :
                    report.risk_level === 'pending' ? 'slate' : 'emerald'
  const wellnessColor = report.wellness_score >= 70 ? '#10b981' :
                        report.wellness_score >= 40 ? '#f59e0b' : '#ef4444'

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
  })

  return (
    <div className="space-y-5">
      {/* ── Header ────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-5 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-indigo-200">{today}</p>
            <h2 className="text-lg font-bold mt-0.5">Your Daily Report</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium">
                Risk: {(report.risk_level || 'unknown').toUpperCase()}
              </span>
              <TrendBadge trend={report.risk_trend} />
              <ImprovementBadge value={report.daily_improvement} />
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <ProgressRing value={report.wellness_score} size={72} strokeWidth={6} color="white" />
            <span className="absolute text-sm font-bold">{report.wellness_score}</span>
          </div>
        </div>
      </motion.div>

      {/* Insufficient data banner */}
      {noActivity && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 text-center">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-bold text-slate-800 text-sm">Not Enough Data Available</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
            Complete your first mood check-in or AI conversation to generate your personalized Daily Report.
            We never display estimated or placeholder analytics.
          </p>
        </motion.div>
      )}

      {/* ── Primary metrics (1-7) ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <Stat icon={HeartPulse}    label="Wellness Score"   value={report.wellness_score}   color="indigo"  delay={0.05} />
        <Stat icon={Shield}        label="Risk Level"       value={(report.risk_level || 'unknown').toUpperCase()} color={riskColor} delay={0.08} />
        <Stat icon={MessageSquare} label="AI Chats Today"   value={report.chats_today}      color="purple"  delay={0.11} />
        <Stat icon={Clock}         label="Time Chatting"    value={`${report.time_spent_min} min`} color="emerald" delay={0.14} />
        <Stat icon={Smile}         label="Daily Mood"       value={report.mood_summary}     color="blue"    delay={0.17}
          sub={report.mood_entries_today > 0 ? `${report.mood_entries_today} check-in${report.mood_entries_today > 1 ? 's' : ''}` : null} />
        <Stat icon={TrendingUp}    label="Positive %"       value={report.chats_today > 0 ? `${report.positive_pct}%` : _INSUF} color="emerald" delay={0.20} />
        <Stat icon={TrendingDown}  label="Negative %"       value={report.chats_today > 0 ? `${report.negative_pct}%` : _INSUF} color="rose"    delay={0.23} />
        <Stat icon={Zap}           label="Daily Streak"     value={`${report.streak} day${report.streak !== 1 ? 's' : ''}`} color="amber" delay={0.26} />
      </div>

      {/* ── Wellbeing indicators (8-13) ───────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
          <Activity size={14} className="text-indigo-500" /> Wellbeing Indicators
        </h3>
        <div className="space-y-3">
          <EmotionBar label="Emotional Stability" pct={report.emotional_stability} color="#5c5ce8" delay={0.35} />
          <EmotionBar label="Stress Level" pct={report.stress_level} color="#f97316" delay={0.38} />
          {report.anxiety !== null && report.anxiety !== undefined && (
            <EmotionBar label="Anxiety" pct={report.anxiety} color="#ef4444" delay={0.41} />
          )}
          {report.burnout !== null && report.burnout !== undefined && (
            <EmotionBar label="Burnout" pct={report.burnout} color="#ec4899" delay={0.44} />
          )}
          <EmotionBar label="Social Connection" pct={report.social_connection} color="#14b8a6" delay={0.47} />
          <EmotionBar label="Motivation" pct={report.motivation} color="#8b5cf6" delay={0.50} />
        </div>
        {report.anxiety === null && (
          <p className="text-[11px] text-slate-400 mt-3 italic">Anxiety & burnout indicators require conversation data to generate.</p>
        )}
      </motion.div>

      {/* ── Secondary metrics (15-19) ─────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <Stat icon={BarChart3}  label="Check-in Consistency" value={`${report.checkin_consistency}%`}
          sub="Last 7 days" color="teal" delay={0.53} />
        <Stat icon={AlertTriangle} label="Risk Alerts Today" value={report.risk_alerts_today}
          color={report.risk_alerts_today > 0 ? 'rose' : 'emerald'} delay={0.56} />
        <Stat icon={Type}       label="Avg Response Length"
          value={report.avg_response_len > 0 ? `${report.avg_response_len} chars` : _INSUF}
          color="slate" delay={0.59} />
        <Stat icon={Sun}        label="Most Active Time"
          value={report.most_active_time || _INSUF}
          color="amber" delay={0.62} />
      </div>

      {/* ── Emotion Distribution Chart ────────────────────────────── */}
      {report.emotion_distribution && report.emotion_distribution.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          <EmotionDistributionChart data={report.emotion_distribution} />
        </motion.div>
      )}

      {/* ── Risk alerts ───────────────────────────────────────────── */}
      {report.risk_alerts_today > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68 }}
          className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-rose-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-rose-800">
              {report.risk_alerts_today} Risk Alert{report.risk_alerts_today > 1 ? 's' : ''} Today
            </p>
            <p className="text-xs text-rose-600 mt-0.5">
              Some of your messages indicated elevated stress or concern.
              Consider talking to someone you trust.
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Daily Improvement ─────────────────────────────────────── */}
      {report.daily_improvement !== null && report.daily_improvement !== undefined && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className={`border rounded-2xl p-4 flex items-center gap-3 ${
            report.daily_improvement > 0 ? 'bg-emerald-50 border-emerald-100' :
            report.daily_improvement < 0 ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-200'
          }`}>
          {report.daily_improvement > 0 ? <TrendingUp size={16} className="text-emerald-600" /> :
           report.daily_improvement < 0 ? <TrendingDown size={16} className="text-rose-600" /> :
           <Minus size={16} className="text-slate-500" />}
          <div>
            <p className={`text-sm font-semibold ${
              report.daily_improvement > 0 ? 'text-emerald-800' :
              report.daily_improvement < 0 ? 'text-rose-800' : 'text-slate-700'
            }`}>
              Daily Improvement: {report.daily_improvement > 0 ? '+' : ''}{report.daily_improvement} points vs yesterday
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Analytics Confidence ─────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }}
        className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <BarChart3 size={14} className="text-indigo-500" /> Analytics Confidence
          </h3>
          <span className={`text-lg font-bold ${
            (report.confidence ?? 0) >= 70 ? 'text-emerald-600' :
            (report.confidence ?? 0) >= 40 ? 'text-amber-600' : 'text-rose-600'
          }`}>
            {report.confidence ?? 0}%
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: (report.confidence ?? 0) >= 70 ? '#10b981' : (report.confidence ?? 0) >= 40 ? '#f59e0b' : '#ef4444' }}
            initial={{ width: 0 }}
            animate={{ width: `${report.confidence ?? 0}%` }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </div>
        <p className="text-[11px] text-slate-400 mb-3">Reflects data completeness — how much real activity backs this report.</p>
        {report.confidence_signals && (
          <div className="grid grid-cols-2 gap-1.5">
            {report.confidence_signals.map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs">
                <span className={s.present ? 'text-emerald-500' : 'text-slate-300'}>
                  {s.present ? '✓' : '○'}
                </span>
                <span className={s.present ? 'text-slate-700' : 'text-slate-400'}>{s.name}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── AI Recommendation (20) ────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.73 }}
        className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-5">
        <h3 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-500" /> AI Wellness Recommendation
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed">{report.recommendation}</p>
        <p className="text-[10px] text-slate-400 mt-2 italic">Generated from aggregated analytics only — your private conversations are never shared.</p>
      </motion.div>
    </div>
  )
}
