import { useEffect, useState } from 'react'
import {
  Users, AlertTriangle, TrendingUp, X, ChevronRight,
  Activity, Brain, MessageSquare, Flame, Hash
} from 'lucide-react'
import api from '../api'

const RISK_COLOR = {
  low:    { bg: 'bg-green-50',  text: 'text-green-700',  badge: 'bg-green-100',  dot: 'bg-green-400' },
  medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100', dot: 'bg-yellow-400' },
  high:   { bg: 'bg-red-50',    text: 'text-red-700',    badge: 'bg-red-100',    dot: 'bg-red-400'   },
}

function RiskBadge({ level }) {
  const c = RISK_COLOR[level] || RISK_COLOR.low
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.badge} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {level?.charAt(0).toUpperCase() + level?.slice(1)}
    </span>
  )
}

function WellnessBar({ score }) {
  const color = score >= 70 ? 'bg-green-400' : score >= 40 ? 'bg-yellow-400' : 'bg-red-400'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-600 w-8 text-right">{score}%</span>
    </div>
  )
}

// ── Weekly Report Modal ──────────────────────────────────────────────────────

function ReportModal({ studentId, studentName, onClose }) {
  const [report,  setReport]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    api.get(`/api/counselor/students/${studentId}/report`)
      .then(res => setReport(res.data.report))
      .catch(() => setError('Could not load report.'))
      .finally(() => setLoading(false))
  }, [studentId])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-5 rounded-t-2xl text-white flex items-start justify-between">
          <div>
            <p className="text-xs text-purple-200 font-medium uppercase tracking-wide">Weekly Report</p>
            <h2 className="text-lg font-bold mt-0.5">{studentName}</h2>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {loading && (
            <div className="flex items-center justify-center py-12 gap-3 text-slate-400">
              <div className="text-2xl animate-bounce">🐝</div>
              <span className="text-sm">Loading report...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          {report && (
            <div className="space-y-5">
              {/* Intervention flag */}
              {report.needs_intervention && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                  <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-700 text-sm">Intervention Recommended</p>
                    <p className="text-xs text-red-600 mt-0.5">{report.risk_context}</p>
                  </div>
                </div>
              )}

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Brain,         label: 'Wellness',     value: `${report.wellness_score}%`, color: 'text-blue-500' },
                  { icon: Activity,      label: 'Risk Level',   value: report.risk_level?.toUpperCase(), color: report.risk_level === 'high' ? 'text-red-500' : 'text-green-500' },
                  { icon: MessageSquare, label: 'AI Chats',     value: `${report.ai_chats_week} this week`, color: 'text-purple-500' },
                  { icon: Flame,         label: 'Streak',       value: `${report.streak} days`, color: 'text-orange-500' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={14} className={color} />
                      <span className="text-xs text-slate-500 font-medium">{label}</span>
                    </div>
                    <p className="font-bold text-slate-800">{value}</p>
                  </div>
                ))}
              </div>

              {/* Wellness bar */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Wellness Score</p>
                <WellnessBar score={report.wellness_score} />
              </div>

              {/* Mood history */}
              {report.mood_history?.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Mood This Week
                    <span className="ml-2 text-slate-400 font-normal normal-case">
                      avg: {report.mood_avg}/5 ({report.mood_count} check-ins)
                    </span>
                  </p>
                  <div className="flex items-end gap-2 h-16">
                    {report.mood_history.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t bg-amber-400 min-h-[4px] transition-all"
                          style={{ height: `${(d.value / 5) * 56}px` }}
                        />
                        <span className="text-xs text-slate-400">{d.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI context */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">AI Assessment</p>
                <p className="text-sm text-slate-700">{report.risk_context}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function AssociatedStudents({ schoolId, searchQuery = '', onViewTimeline = null }) {
  const [students,       setStudents]       = useState([])
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [filterRisk,     setFilterRisk]     = useState('all')

  useEffect(() => {
    api.get('/api/counselor/students')
      .then(res => setStudents(res.data.students || []))
      .catch(() => setError('Could not load students.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filterRisk === 'all'
    ? students
    : students.filter(s => s.risk_level === filterRisk)

  const highRisk = students.filter(s => s.risk_level === 'high').length

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border p-8 flex items-center justify-center gap-3 text-slate-400">
        <div className="text-2xl animate-bounce">🐝</div>
        <span className="text-sm">Loading students...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">
        {error}
      </div>
    )
  }

  return (
    <>
      {/* Report modal */}
      {selectedStudent && (
        <ReportModal
          studentId={selectedStudent.id}
          studentName={selectedStudent.name}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      <div className="bg-white rounded-2xl border overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <Users size={18} className="text-purple-500" />
              <h3 className="font-bold text-slate-800">Your Branch Students</h3>
              <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                {students.length}
              </span>
            </div>
            {highRisk > 0 && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertTriangle size={11} />
                {highRisk} student{highRisk !== 1 ? 's' : ''} need{highRisk === 1 ? 's' : ''} attention
              </p>
            )}
          </div>

          {/* Risk filter */}
          <div className="flex gap-1.5">
            {['all', 'high', 'medium', 'low'].map(f => (
              <button
                key={f}
                onClick={() => setFilterRisk(f)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors capitalize
                  ${filterRisk === f
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Student list */}
        {students.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-4xl mb-3">🏫</div>
            <p className="font-semibold text-slate-600 mb-1">No students yet</p>
            <p className="text-sm text-slate-400">
              Students will appear here once they link to your school branch.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No students match this filter.
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map(student => (
              <div
                key={student.id}
                className="p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400
                                  flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {student.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-semibold text-slate-800 text-sm truncate">{student.name}</p>
                      <RiskBadge level={student.risk_level} />
                    </div>

                    {student.roll_number && (
                      <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                        <Hash size={10} />
                        {student.roll_number}
                      </p>
                    )}

                    <WellnessBar score={student.wellness_score} />

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MessageSquare size={11} />
                          {student.ai_chats} chats
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame size={11} />
                          {student.streak}d streak
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="flex items-center gap-1 text-xs text-purple-600 font-semibold
                                   hover:text-purple-800 transition-colors"
                      >
                        Weekly Report
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

