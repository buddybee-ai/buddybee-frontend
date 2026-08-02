import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, School, AlertTriangle, TrendingUp,
  Building2, UserPlus, MapPin, ChevronDown,
  CheckCircle2, AlertCircle, Briefcase, Search,
  BookOpen, BarChart2, Activity
} from 'lucide-react'

import api from '../../api'
import { useAuth } from '../../context/AuthContext'
import StatsCard from '../../components/StatsCard'
import { BehavioralTrendsChart, RiskDistributionChart } from '../../components/Charts'

// ── Engagement Metrics Panel ──────────────────────────────────────────────────
function EngagementMetrics({ students }) {
  if (!students || students.length === 0) return null

  const totalChats    = students.reduce((s, st) => s + (st.ai_chats || 0), 0)
  const avgWellness   = Math.round(students.reduce((s, st) => s + (st.wellness_score || 70), 0) / students.length)
  const highRisk      = students.filter(s => s.risk_level === 'high').length
  const mediumRisk    = students.filter(s => s.risk_level === 'medium').length
  const engagementPct = students.length ? Math.round((students.filter(s => s.ai_chats > 0).length / students.length) * 100) : 0

  return (
    <div className="bg-white border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={16} className="text-indigo-500" />
        <h3 className="font-bold text-slate-800 text-sm">Platform Engagement Metrics</h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Wellness', value: `${avgWellness}%`, color: 'emerald', bar: avgWellness },
          { label: 'AI Engagement', value: `${engagementPct}%`, color: 'indigo', bar: engagementPct },
          { label: 'Total AI Chats', value: totalChats, color: 'purple', bar: null },
          { label: 'High Risk Students', value: highRisk, color: 'rose', bar: null, sub: `${mediumRisk} medium` },
        ].map(m => (
          <div key={m.label} className={`p-4 rounded-xl border bg-${m.color}-50 border-${m.color}-100`}>
            <div className={`text-2xl font-bold text-${m.color}-700`}>{m.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{m.label}</div>
            {m.sub && <div className="text-xs text-slate-400 mt-0.5">{m.sub}</div>}
            {m.bar !== null && (
              <div className="mt-2 h-1.5 bg-white rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${m.color}-500 rounded-full transition-all duration-700`}
                  style={{ width: `${Math.min(m.bar, 100)}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Risk Overview Heat Table ──────────────────────────────────────────────────
function RiskOverview({ students }) {
  if (!students || students.length === 0) return null
  const bySchool = students.reduce((acc, s) => {
    const key = s.school_name || 'Unassigned'
    if (!acc[key]) acc[key] = { total: 0, high: 0, medium: 0, low: 0 }
    acc[key].total++
    acc[key][s.risk_level || 'low']++
    return acc
  }, {})

  return (
    <div className="bg-white border rounded-2xl overflow-hidden">
      <div className="p-5 border-b flex items-center gap-2">
        <AlertTriangle size={16} className="text-rose-500" />
        <h3 className="font-bold text-slate-800 text-sm">Risk Overview by School</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">School</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Students</th>
              <th className="px-5 py-3 text-xs font-semibold text-emerald-600 uppercase">Low</th>
              <th className="px-5 py-3 text-xs font-semibold text-amber-600 uppercase">Medium</th>
              <th className="px-5 py-3 text-xs font-semibold text-rose-600 uppercase">High</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Risk Bar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Object.entries(bySchool).map(([school, data]) => (
              <tr key={school} className="hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-800">{school}</td>
                <td className="px-5 py-3 text-slate-600">{data.total}</td>
                <td className="px-5 py-3 text-emerald-700 font-semibold">{data.low || 0}</td>
                <td className="px-5 py-3 text-amber-700 font-semibold">{data.medium || 0}</td>
                <td className="px-5 py-3 text-rose-700 font-semibold">{data.high || 0}</td>
                <td className="px-5 py-3">
                  <div className="flex h-2 rounded-full overflow-hidden w-24 bg-slate-100">
                    <div className="bg-emerald-400" style={{ width: `${Math.round(((data.low || 0) / data.total) * 100)}%` }} />
                    <div className="bg-amber-400"   style={{ width: `${Math.round(((data.medium || 0) / data.total) * 100)}%` }} />
                    <div className="bg-rose-500"    style={{ width: `${Math.round(((data.high || 0) / data.total) * 100)}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Register School Form (unchanged logic, same API) ──────────────────────────
function RegisterSchoolForm({ onSuccess }) {
  const [schoolName, setSchoolName] = useState('')
  const [branchName, setBranchName] = useState('')
  const [schoolId,   setSchoolId]   = useState('')
  const [address,    setAddress]    = useState('')
  const [city,       setCity]       = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState('')

  const autoId = () => {
    const base = [schoolName, branchName].filter(Boolean).join('_').toUpperCase()
      .replace(/[^A-Z0-9]/g, '_').replace(/_+/g, '_').slice(0, 24)
    setSchoolId(base)
  }

  const handleSubmit = async () => {
    if (!schoolId.trim() || !schoolName.trim()) { setError('School Name and Branch ID are required.'); return }
    setSubmitting(true); setError(''); setSuccess('')
    try {
      const res = await api.post('/api/admin/schools/register', {
        school_id:   schoolId.trim().toUpperCase().replace(/\s+/g, '_'),
        school_name: schoolName.trim(),
        branch_name: branchName.trim() || null,
        address:     address.trim() || null,
        city:        city.trim() || null,
      })
      setSuccess(res.data.message)
      setSchoolName(''); setBranchName(''); setSchoolId(''); setAddress(''); setCity('')
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-5 text-white">
        <div className="flex items-center gap-2 mb-1"><Building2 size={18} /><span className="font-bold">Register New School Branch</span></div>
        <p className="text-xs text-slate-300">When a school contacts BuddyBee, add them here first — then create their counselor account.</p>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">School Name <span className="text-red-400">*</span></label>
            <input type="text" placeholder="e.g. City School" value={schoolName}
              onChange={e => setSchoolName(e.target.value)} onBlur={autoId}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Branch Name</label>
            <input type="text" placeholder="e.g. Saddar Branch" value={branchName}
              onChange={e => setBranchName(e.target.value)} onBlur={autoId}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Branch ID <span className="text-red-400">*</span> <span className="ml-2 text-slate-400 font-normal normal-case">(auto-filled)</span></label>
          <input type="text" placeholder="e.g. CITY_SCHOOL_SADDAR" value={schoolId}
            onChange={e => setSchoolId(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 font-mono focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Address</label>
            <input type="text" placeholder="Street / Area" value={address} onChange={e => setAddress(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">City</label>
            <input type="text" placeholder="e.g. Rawalpindi" value={city} onChange={e => setCity(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100" />
          </div>
        </div>
        {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2"><AlertCircle size={14} className="text-red-500" /><p className="text-xs text-red-600">{error}</p></div>}
        {success && <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2"><CheckCircle2 size={14} className="text-green-500" /><p className="text-xs text-green-600">{success}</p></div>}
        <button onClick={handleSubmit} disabled={submitting}
          className="w-full py-3 bg-gradient-to-r from-slate-700 to-slate-900 text-white font-semibold text-sm rounded-xl hover:from-slate-800 hover:to-black transition-all disabled:opacity-50 shadow-sm">
          {submitting ? '🐝 Registering...' : '+ Register School Branch'}
        </button>
      </div>
    </div>
  )
}

// ── Create Counselor Form (unchanged logic) ───────────────────────────────────
function CreateCounselorForm({ schools, onSuccess }) {
  const [name,       setName]       = useState('')
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [schoolId,   setSchoolId]   = useState('')
  const [showPass,   setShowPass]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState('')

  const grouped = schools.reduce((acc, b) => {
    const key = b.school_name
    if (!acc[key]) acc[key] = []
    acc[key].push(b)
    return acc
  }, {})

  const handleSubmit = async () => {
    if (!name || !email || !password || !schoolId) { setError('All fields are required.'); return }
    setSubmitting(true); setError(''); setSuccess('')
    try {
      const res = await api.post('/api/admin/counselors/create', { name, email, password, school_id: schoolId })
      setSuccess(res.data.message)
      setName(''); setEmail(''); setPassword(''); setSchoolId('')
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create counselor.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 text-white">
        <div className="flex items-center gap-2 mb-1"><UserPlus size={18} /><span className="font-bold">Create Counselor Account</span></div>
        <p className="text-xs text-purple-200">Register the branch first, then create the counselor here.</p>
      </div>
      <div className="p-6 space-y-4">
        {schools.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 text-center">No school branches registered yet.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Full Name <span className="text-red-400">*</span></label>
                <input type="text" placeholder="Dr. Ayesha Khan" value={name} onChange={e => setName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Email <span className="text-red-400">*</span></label>
                <input type="email" placeholder="counselor@school.edu" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Temporary Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="Set a temporary password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm bg-slate-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Assign to Branch <span className="text-red-400">*</span></label>
              <div className="relative">
                <select value={schoolId} onChange={e => setSchoolId(e.target.value)}
                  className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 pr-10">
                  <option value="">— Select branch —</option>
                  {Object.entries(grouped).map(([sName, branches]) => (
                    <optgroup key={sName} label={sName}>
                      {branches.map(b => (
                        <option key={b.school_id} value={b.school_id}>
                          {b.branch_name ? `${b.branch_name}${b.city ? ` (${b.city})` : ''}` : b.school_id}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2"><AlertCircle size={14} className="text-red-500" /><p className="text-xs text-red-600">{error}</p></div>}
            {success && <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2"><CheckCircle2 size={14} className="text-green-500" /><p className="text-xs text-green-600">{success}</p></div>}
            <button onClick={handleSubmit} disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-sm">
              {submitting ? '🐝 Creating...' : '+ Create Counselor Account'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Schools List ──────────────────────────────────────────────────────────────
function SchoolsList({ schools, counselors }) {
  if (schools.length === 0) return (
    <div className="bg-white rounded-2xl border p-10 text-center">
      <div className="text-4xl mb-3">🏫</div>
      <p className="font-semibold text-slate-600">No schools registered yet</p>
    </div>
  )
  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <div className="p-5 border-b flex items-center gap-2">
        <School size={18} className="text-slate-500" />
        <h3 className="font-bold text-slate-800">Registered Branches</h3>
        <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">{schools.length}</span>
      </div>
      <div className="divide-y">
        {schools.map(school => {
          const branchCounselors = counselors.filter(c => c.school_id === school.school_id)
          return (
            <div key={school.school_id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-800">{school.school_name}</p>
                    {school.branch_name && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">{school.branch_name}</span>}
                    <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{school.school_id}</span>
                  </div>
                  {school.address && (
                    <p className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                      <MapPin size={11} />{school.address}{school.city ? `, ${school.city}` : ''}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {branchCounselors.length === 0
                      ? <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">⚠️ No counselor assigned</span>
                      : branchCounselors.map(c => (
                          <span key={c.id} className="flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">
                            <Briefcase size={10} />{c.name}
                          </span>
                        ))
                    }
                  </div>
                </div>
                <div className="flex gap-3 text-center flex-shrink-0">
                  <div className="bg-blue-50 rounded-xl px-3 py-2">
                    <p className="text-lg font-bold text-blue-700">{school.student_count}</p>
                    <p className="text-xs text-blue-500">Students</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl px-3 py-2">
                    <p className="text-lg font-bold text-purple-700">{school.counselor_count}</p>
                    <p className="text-xs text-purple-500">Counselors</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── All Students List ─────────────────────────────────────────────────────────
function AllStudentsList({ students }) {
  const [search,     setSearch]     = useState('')
  const [riskFilter, setRiskFilter] = useState('all')

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.school_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(search.toLowerCase())
    const matchRisk = riskFilter === 'all' || s.risk_level === riskFilter
    return matchSearch && matchRisk
  })

  const riskColor = level => {
    if (level === 'high')   return 'bg-red-100 text-red-700'
    if (level === 'medium') return 'bg-amber-100 text-amber-700'
    return 'bg-green-100 text-green-700'
  }

  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Users size={18} className="text-blue-500" />
          <h3 className="font-bold text-slate-800">All Students</h3>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{students.length}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'low', 'medium', 'high'].map(r => (
            <button key={r} onClick={() => setRiskFilter(r)}
              className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-colors capitalize
                ${riskFilter === r ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>
              {r === 'all' ? 'All' : r}
            </button>
          ))}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:border-blue-400 w-48" />
          </div>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="p-10 text-center">
          <div className="text-4xl mb-3">🎓</div>
          <p className="font-semibold text-slate-600">{students.length === 0 ? 'No students registered yet' : 'No students match your filter'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Student</th>
                <th className="px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">School / Branch</th>
                <th className="px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Roll #</th>
                <th className="px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Wellness</th>
                <th className="px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Risk</th>
                <th className="px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">Chats</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {s.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {s.school_name ? (
                      <div>
                        <p className="font-medium text-slate-700">{s.school_name}</p>
                        {s.branch_name && <p className="text-xs text-slate-400">{s.branch_name}{s.city ? ` · ${s.city}` : ''}</p>}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Not associated</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs font-mono">{s.roll_number || <span className="text-slate-300">—</span>}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5 w-16">
                        <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${s.wellness_score}%` }} />
                      </div>
                      <span className="text-xs text-slate-600 font-medium">{s.wellness_score}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${riskColor(s.risk_level)}`}>{s.risk_level}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 text-xs">{s.ai_chats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Main AdminDashboard ───────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user } = useAuth()

  const [dashboard,  setDashboard]  = useState(null)
  const [schools,    setSchools]    = useState([])
  const [counselors, setCounselors] = useState([])
  const [students,   setStudents]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [tab,        setTab]        = useState('overview')

  const fetchAll = async () => {
    try {
      const [dashRes, schoolsRes, counselorsRes, studentsRes] = await Promise.all([
        api.get('/api/admin/dashboard'),
        api.get('/api/admin/schools'),
        api.get('/api/admin/counselors'),
        api.get('/api/admin/students'),
      ])
      setDashboard(dashRes.data)
      setSchools(schoolsRes.data.schools || [])
      setCounselors(counselorsRes.data.counselors || [])
      setStudents(studentsRes.data.students || [])
    } catch (err) {
      if (err.response?.status !== 401) setError('Could not load admin dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-full p-10">
      <div className="text-center"><div className="text-4xl mb-3 animate-bounce">🐝</div><p className="text-slate-500 text-sm">Loading Admin Dashboard...</p></div>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-full p-10">
      <div className="text-center"><div className="text-4xl mb-3">⚠️</div><p className="text-slate-500 text-sm">{error}</p></div>
    </div>
  )

  const tabs = [
    { key: 'overview',   label: '📊 Overview',    icon: BarChart2 },
    { key: 'schools',    label: '🏫 Schools',      icon: School },
    { key: 'counselors', label: '👨‍💼 Counselors',  icon: Briefcase },
    { key: 'students',   label: '🎓 Students',     icon: Users },
  ]

  return (
    <div className="p-5 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-700 to-slate-900 text-white p-6 rounded-2xl"
      >
        <p className="text-sm text-slate-400">Welcome, {user?.name}</p>
        <h1 className="text-2xl font-bold">Admin Control Panel</h1>
        <div className="flex gap-4 mt-3">
          <div className="bg-white/10 rounded-xl px-3 py-2 text-center">
            <div className="font-bold text-lg">{students.length}</div>
            <div className="text-xs text-slate-400">Students</div>
          </div>
          <div className="bg-white/10 rounded-xl px-3 py-2 text-center">
            <div className="font-bold text-lg">{schools.length}</div>
            <div className="text-xs text-slate-400">Branches</div>
          </div>
          <div className="bg-white/10 rounded-xl px-3 py-2 text-center">
            <div className="font-bold text-lg">{counselors.length}</div>
            <div className="text-xs text-slate-400">Counselors</div>
          </div>
          <div className="bg-white/10 rounded-xl px-3 py-2 text-center">
            <div className="font-bold text-lg text-rose-400">{students.filter(s => s.risk_level === 'high').length}</div>
            <div className="text-xs text-slate-400">High Risk</div>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-1 border-b flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors
              ${tab === t.key ? 'border-slate-700 text-slate-900 bg-slate-100' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Students"   value={students.length}        icon={Users}         color="blue"   />
            <StatsCard title="Branches"   value={schools.length}         icon={School}        color="purple" />
            <StatsCard title="Alerts"     value={dashboard?.alerts || 0} icon={AlertTriangle} color="red"    />
            <StatsCard title="Counselors" value={counselors.length}      icon={Briefcase}     color="green"  />
          </div>
          <EngagementMetrics students={students} />
          <RiskOverview students={students} />
          <div className="grid lg:grid-cols-2 gap-5">
            <RiskDistributionChart data={dashboard?.riskDistribution || []} />
            <BehavioralTrendsChart data={dashboard?.behavioralTrends || []} />
          </div>
        </motion.div>
      )}

      {tab === 'schools' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <p className="font-semibold text-blue-800 text-sm mb-2">📋 How to onboard a new school</p>
            <ol className="space-y-1 text-xs text-blue-700 list-decimal list-inside">
              <li>School contacts BuddyBee (email / phone)</li>
              <li>Register their branch here (name, address, unique ID)</li>
              <li>Create counselor account in the Counselors tab</li>
              <li>Share credentials with the counselor</li>
              <li>Students self-associate via their dashboard</li>
            </ol>
          </div>
          <RegisterSchoolForm onSuccess={fetchAll} />
          <SchoolsList schools={schools} counselors={counselors} />
        </motion.div>
      )}

      {tab === 'counselors' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <CreateCounselorForm schools={schools} onSuccess={fetchAll} />
          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="p-5 border-b flex items-center gap-2">
              <Briefcase size={18} className="text-purple-500" />
              <h3 className="font-bold text-slate-800">All Counselors</h3>
              <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full">{counselors.length}</span>
            </div>
            {counselors.length === 0 ? (
              <div className="p-10 text-center"><div className="text-4xl mb-3">👨‍💼</div><p className="font-semibold text-slate-600">No counselors yet</p></div>
            ) : (
              <div className="divide-y">
                {counselors.map(c => (
                  <div key={c.id} className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {c.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {c.school_name ? (
                        <>
                          <p className="text-xs font-semibold text-slate-700">{c.school_name}</p>
                          {c.branch_name && <p className="text-xs text-slate-400">{c.branch_name}</p>}
                          {c.city && <p className="text-xs text-slate-400 flex items-center gap-1 justify-end"><MapPin size={10} />{c.city}</p>}
                        </>
                      ) : (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">No branch assigned</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {tab === 'students' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <AllStudentsList students={students} />
        </motion.div>
      )}
    </div>
  )
}

