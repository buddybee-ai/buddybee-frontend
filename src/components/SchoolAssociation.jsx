import { useEffect, useState } from 'react'
import { School, MapPin, Hash, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react'
import api from '../api'

/**
 * SchoolAssociation
 * Lets a student pick their exact school branch (grouped by school name)
 * and enter their roll number. Shows current association if already linked.
 */
export default function SchoolAssociation({ onAssociated }) {
  const [schools,     setSchools]     = useState([])
  const [association, setAssociation] = useState(null)
  const [loading,     setLoading]     = useState(true)

  const [selectedId,   setSelectedId]   = useState('')
  const [rollNumber,   setRollNumber]   = useState('')
  const [submitting,   setSubmitting]   = useState(false)
  const [success,      setSuccess]      = useState('')
  const [error,        setError]        = useState('')

  // Load schools list + current association
  useEffect(() => {
    const load = async () => {
      try {
        const [schoolsRes, assocRes] = await Promise.all([
          api.get('/api/schools'),
          api.get('/api/student/my-school'),
        ])
        setSchools(schoolsRes.data.schools || [])
        setAssociation(assocRes.data.association || null)
      } catch (err) {
        setError('Could not load school data. Please refresh.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Group branches by school_name for the dropdown
  const grouped = schools.reduce((acc, branch) => {
    const key = branch.school_name
    if (!acc[key]) acc[key] = []
    acc[key].push(branch)
    return acc
  }, {})

  const selectedBranch = schools.find(s => s.school_id === selectedId)

  const handleSubmit = async () => {
    if (!selectedId) {
      setError('Please select your school branch.')
      return
    }
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const res = await api.post('/api/student/associate-school', {
        school_id:   selectedId,
        roll_number: rollNumber || null,
      })
      setAssociation({
        school_id:   selectedId,
        roll_number: rollNumber,
        status:      'pending',
        ...res.data.branch,
      })
      setSuccess('Successfully associated with your school branch!')
      if (onAssociated) onAssociated(res.data.branch)
    } catch (err) {
      setError(err.response?.data?.detail || 'Association failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border p-6 flex items-center gap-3 text-slate-400">
        <div className="animate-spin text-xl">🐝</div>
        <span className="text-sm">Loading school data...</span>
      </div>
    )
  }

  // Already associated — show current info + option to change
  if (association) {
    return (
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={18} />
            <span className="font-semibold text-sm">Linked to School</span>
          </div>
          <p className="text-xs text-green-100">
            Your mental health reports are shared with your school counselor.
          </p>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-start gap-3">
            <School size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-800 text-sm">{association.school_name}</p>
              {association.branch_name && (
                <p className="text-xs text-slate-500">{association.branch_name}</p>
              )}
            </div>
          </div>

          {association.address && (
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-600">
                {association.address}
                {association.city ? `, ${association.city}` : ''}
              </p>
            </div>
          )}

          {association.roll_number && (
            <div className="flex items-center gap-3">
              <Hash size={18} className="text-slate-400 flex-shrink-0" />
              <p className="text-xs text-slate-600">Roll No: <span className="font-mono font-semibold">{association.roll_number}</span></p>
            </div>
          )}

          <div className="pt-1">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
              ${association.status === 'pending'
                ? 'bg-yellow-50 text-yellow-700'
                : 'bg-green-50 text-green-700'}`}>
              {association.status === 'pending' ? '⏳ Awaiting school confirmation' : '✅ Verified'}
            </span>
          </div>

          {/* Option to re-associate */}
          <button
            onClick={() => { setAssociation(null); setSuccess(''); setError('') }}
            className="text-xs text-slate-400 hover:text-amber-600 underline transition-colors mt-2"
          >
            Change school branch
          </button>
        </div>
      </div>
    )
  }

  // No association yet — show form
  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <School size={18} />
          <span className="font-semibold text-sm">Link to Your School</span>
        </div>
        <p className="text-xs text-amber-100">
          Associate with your school so counselors can monitor your wellbeing.
        </p>
      </div>

      <div className="p-5 space-y-4">
        {schools.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-slate-500">No schools registered yet.</p>
            <p className="text-xs text-slate-400 mt-1">Ask your school to contact BuddyBee.</p>
          </div>
        ) : (
          <>
            {/* Branch selector — grouped by school name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Select Your School Branch
              </label>
              <div className="relative">
                <select
                  value={selectedId}
                  onChange={e => { setSelectedId(e.target.value); setError('') }}
                  className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 text-sm
                             text-slate-700 bg-slate-50 focus:outline-none focus:border-amber-400
                             focus:ring-2 focus:ring-amber-100 pr-10"
                >
                  <option value="">— Choose your branch —</option>
                  {Object.entries(grouped).map(([schoolName, branches]) => (
                    <optgroup key={schoolName} label={schoolName}>
                      {branches.map(b => (
                        <option key={b.school_id} value={b.school_id}>
                          {b.branch_name
                            ? `${b.branch_name}${b.city ? ` — ${b.city}` : ''}`
                            : b.school_id}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Show address of selected branch */}
              {selectedBranch?.address && (
                <div className="mt-2 flex items-start gap-2 bg-amber-50 rounded-lg px-3 py-2">
                  <MapPin size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    {selectedBranch.address}
                    {selectedBranch.city ? `, ${selectedBranch.city}` : ''}
                  </p>
                </div>
              )}
            </div>

            {/* Roll number */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Roll Number / Student ID
              </label>
              <div className="relative">
                <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. CS-2024-101"
                  value={rollNumber}
                  onChange={e => setRollNumber(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm
                             bg-slate-50 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Used by your school to verify your enrollment.</p>
            </div>

            {/* Status messages */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                <p className="text-xs text-green-600">{success}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting || !selectedId}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white
                         font-semibold text-sm rounded-xl hover:from-amber-600 hover:to-yellow-600
                         transition-all disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-sm hover:shadow-md"
            >
              {submitting ? '🐝 Linking...' : 'Link to School Branch'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
