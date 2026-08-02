import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, AlertTriangle, Brain, MessageSquare,
  MapPin, Building2, Clock, TrendingUp, Search, Eye
} from 'lucide-react'

import api from '../../api'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LanguageContext'
import { getT } from '../../translations'

import StatsCard from '../../components/StatsCard'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import { RiskDistributionChart, CounselorWeeklyChart, BehavioralTrendsChart } from '../../components/Charts'
import AssociatedStudents from '../../components/AssociatedStudents'

// ── Risk Heatmap ──────────────────────────────────────────────────────────────
function RiskHeatmap({ distribution }) {
  const total = distribution.reduce((s, d) => s + d.value, 0) || 1
  const colors = { Low: 'bg-emerald-100 text-emerald-800 border-emerald-200', Medium: 'bg-amber-100 text-amber-800 border-amber-200', High: 'bg-rose-100 text-rose-800 border-rose-200' }

  return (
    <div className="bg-white border p-5 rounded-2xl">
      <h3 className="font-bold text-slate-800 text-sm mb-4">Risk Distribution Heatmap</h3>
      <div className="space-y-3">
        {distribution.map(d => (
          <div key={d.name} className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border w-16 text-center ${colors[d.name] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
              {d.name}
            </span>
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  d.name === 'High' ? 'bg-rose-500' : d.name === 'Medium' ? 'bg-amber-400' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.round((d.value / total) * 100)}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-700 w-8 text-right">{d.value}</span>
            <span className="text-xs text-slate-400">{Math.round((d.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Intervention Queue ────────────────────────────────────────────────────────
function InterventionQueue({ highRiskCount, schoolId }) {
  const [students, setStudents] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    if (!schoolId) { setLoading(false); return }
    api.get('/api/counselor/students?limit=50')
      .then(res => {
        const high = (res.data.students || []).filter(s => s.risk_level === 'high')
        setStudents(high)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [schoolId])

  if (!schoolId) return null

  return (
    <div className="bg-white border p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} className="text-rose-500" />
          <h3 className="font-bold text-slate-800 text-sm">Intervention Queue</h3>
          {students.length > 0 && (
            <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {students.length}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">High-risk students needing attention</span>
      </div>

      {loading ? (
        <div className="text-sm text-slate-400 text-center py-4">Loading...</div>
      ) : students.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-sm text-slate-500">No high-risk students right now</p>
        </div>
      ) : (
        <div className="space-y-2">
          {students.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-rose-700 font-bold text-sm flex-shrink-0">
                {(s.name || '?')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-slate-800 truncate">{s.name}</div>
                <div className="text-xs text-slate-500">
                  Wellness: {s.wellness_score} · {s.ai_chats} chats
                </div>
              </div>
              <span className="text-xs bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">
                HIGH
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Student Timeline ──────────────────────────────────────────────────────────
function StudentTimeline({ student, onClose }) {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/api/counselor/students/${student.id}/report`)
      .then(res => setReport(res.data.report))
      .catch(() => setReport(null))
      .finally(() => setLoading(false))
  }, [student.id])

  return (
    <div className="bg-white border p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-indigo-500" />
          <h3 className="font-bold text-slate-800 text-sm">Student Timeline — {student.name}</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm">✕ Close</button>
      </div>

      {loading ? (
        <div className="text-sm text-slate-400 text-center py-4">Loading report...</div>
      ) : !report ? (
        <p className="text-sm text-slate-500">No report available yet for this student.</p>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border rounded-xl p-3 text-center">
              <div className="font-bold text-lg">{report.total_messages || 0}</div>
              <div className="text-xs text-slate-500">Total Messages</div>
            </div>
            <div className="bg-slate-50 border rounded-xl p-3 text-center">
              <div className={`font-bold text-lg ${report.risk_level === 'high' ? 'text-rose-600' : report.risk_level === 'medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
                {(report.risk_level || 'low').toUpperCase()}
              </div>
              <div className="text-xs text-slate-500">Risk Level</div>
            </div>
            <div className="bg-slate-50 border rounded-xl p-3 text-center">
              <div className="font-bold text-lg">{report.wellness_score || 70}</div>
              <div className="text-xs text-slate-500">Wellness Score</div>
            </div>
          </div>
          {report.risk_trend && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-sm text-indigo-700">
              📈 Risk Trend: <strong>{report.risk_trend}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function CounselorDashboard() {
  const { user }   = useAuth()
  const { lang }   = useLang()
  const T          = getT(lang)

  const isUrdu   = lang === 'ur'
  const urduFont = "'Noto Nastaliq Urdu', serif"
  const textStyle = isUrdu ? { fontFamily: urduFont, direction: 'rtl', textAlign: 'right' } : {}

  const [dashboard,       setDashboard]       = useState(null)
  const [branch,          setBranch]          = useState(null)
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState(null)
  const [tab,             setTab]             = useState('overview')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [searchQuery,     setSearchQuery]     = useState('')

  const fetchDashboard = async () => {
    try {
      const [dashRes, branchRes] = await Promise.all([
        api.get('/api/counselor/dashboard'),
        api.get('/api/schools/my-branch'),
      ])
      setDashboard(dashRes.data)
      setBranch(branchRes.data.branch)
    } catch (err) {
      if (err.response?.status !== 401) setError(T('common.error'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDashboard() }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return T('student.greeting_morning')
    if (h < 17) return T('student.greeting_afternoon')
    return T('student.greeting_evening')
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full p-10">
      <div className="text-center">
        <div className="text-4xl mb-3 animate-bounce">🐝</div>
        <p className="text-slate-500 text-sm" style={textStyle}>{T('common.loading')}</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-full p-10">
      <div className="text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-slate-500 text-sm" style={textStyle}>{error}</p>
      </div>
    </div>
  )

  const hasSchool = !!dashboard?.schoolId

  return (
    <div className="p-5 max-w-7xl mx-auto space-y-5">
      {isUrdu && <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap');`}</style>}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-2xl text-white"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1" style={isUrdu ? { direction: 'rtl', textAlign: 'right' } : {}}>
            <p className="text-sm text-purple-100" style={isUrdu ? { fontFamily: urduFont } : {}}>
              {greeting()}, {user?.name}
            </p>
            <h1 className="text-2xl font-bold" style={isUrdu ? { fontFamily: urduFont } : {}}>
              {hasSchool
                ? `${dashboard?.highRiskCount || 0} ${T('counselor.needsAttention')}`
                : T('counselor.waitingAssign')}
            </h1>
            {branch ? (
              <div className="flex items-center gap-2 mt-2 bg-white/10 rounded-xl px-3 py-2 w-fit">
                <Building2 size={14} className="text-purple-200" />
                <span className="text-sm font-semibold text-white">
                  {branch.school_name}{branch.branch_name ? ` — ${branch.branch_name}` : ''}
                </span>
                {branch.city && (
                  <>
                    <span className="text-purple-300">·</span>
                    <MapPin size={12} className="text-purple-200" />
                    <span className="text-xs text-purple-200">{branch.city}</span>
                  </>
                )}
              </div>
            ) : (
              <p className="text-sm text-purple-200 mt-1" style={isUrdu ? { fontFamily: urduFont } : {}}>
                {T('counselor.contactAdmin')}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 mt-1"><LanguageSwitcher /></div>
        </div>
      </motion.div>

      {/* No school warning */}
      {!hasSchool && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">🏫</div>
          <p className="font-bold text-amber-800 text-base mb-1" style={textStyle}>{T('counselor.noSchoolWarning')}</p>
          <p className="text-sm text-amber-600 max-w-sm mx-auto" style={textStyle}>{T('counselor.contactAdmin')}</p>
        </div>
      )}

      {hasSchool && (
        <>
          {/* Tabs */}
          <div className="flex gap-2 border-b pb-0" style={isUrdu ? { flexDirection: 'row-reverse' } : {}}>
            {[
              { key: 'overview',      label: T('counselor.overview'),    icon: TrendingUp },
              { key: 'interventions', label: 'Interventions',            icon: AlertTriangle },
              { key: 'students',      label: T('counselor.myStudents'),  icon: Users },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors
                  ${tab === t.key ? 'border-purple-600 text-purple-700 bg-purple-50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                style={isUrdu ? { fontFamily: urduFont } : {}}
              >
                <t.icon size={13} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {tab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard title={T('counselor.totalStudents')} value={dashboard?.totalStudents || 0} icon={Users}         color="purple" />
                <StatsCard title={T('counselor.highRisk')}      value={dashboard?.highRiskCount || 0} icon={AlertTriangle} color="red"    />
                <StatsCard title={T('counselor.avgWellness')}   value={dashboard?.avgWellness || 0}   icon={Brain}         color="blue"   />
                <StatsCard title={T('counselor.sessions')}      value={dashboard?.sessionsToday || 0} icon={MessageSquare} color="green"  />
              </div>

              <div className="grid lg:grid-cols-2 gap-5">
                <RiskDistributionChart data={dashboard?.riskDistribution || []} />
                <CounselorWeeklyChart  data={dashboard?.weeklyData || []} />
              </div>

              <RiskHeatmap distribution={dashboard?.riskDistribution || []} />
              <BehavioralTrendsChart data={dashboard?.behavioralTrends || []} />
            </motion.div>
          )}

          {/* Interventions Tab */}
          {tab === 'interventions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <InterventionQueue highRiskCount={dashboard?.highRiskCount || 0} schoolId={dashboard?.schoolId} />

              {selectedStudent && (
                <StudentTimeline student={selectedStudent} onClose={() => setSelectedStudent(null)} />
              )}

              {/* All alerts */}
              <div className="bg-white p-5 rounded-2xl border">
                <h3 className="font-bold mb-4 text-slate-800" style={textStyle}>{T('counselor.interventions')}</h3>
                {dashboard?.alerts?.length > 0 ? (
                  <div className="space-y-3">
                    {dashboard.alerts.map((alert, i) => (
                      <div key={i} className="p-3 bg-red-50 border border-red-200 rounded-xl">
                        <div className="font-semibold text-sm">{alert.student}</div>
                        <div className="text-xs">{alert.msg}</div>
                        <div className="text-xs text-slate-400 mt-1">{alert.time}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500" style={textStyle}>{T('counselor.noAlerts')}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Students Tab */}
          {tab === 'students' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              {selectedStudent && (
                <StudentTimeline student={selectedStudent} onClose={() => setSelectedStudent(null)} />
              )}

              <AssociatedStudents
                schoolId={dashboard?.schoolId}
                searchQuery={searchQuery}
                onViewTimeline={setSelectedStudent}
              />
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}

