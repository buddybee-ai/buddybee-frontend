import { useEffect, useState } from 'react'
import { School, MapPin, Building2, CheckCircle2, AlertCircle, PlusCircle } from 'lucide-react'
import api from '../api'

/**
 * CounselorMySchool
 * Counselors register their school branch here (once), after which they are
 * permanently linked to it and the component shows the branch details.
 */
export default function CounselorMySchool({ onBranchSet }) {
  const [branch,     setBranch]     = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [showForm,   setShowForm]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success,    setSuccess]    = useState('')
  const [error,      setError]      = useState('')

  // Form state
  const [schoolId,   setSchoolId]   = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [branchName, setBranchName] = useState('')
  const [address,    setAddress]    = useState('')
  const [city,       setCity]       = useState('')

  useEffect(() => {
    api.get('/api/schools/my-branch')
      .then(res => {
        setBranch(res.data.branch || null)
        if (!res.data.branch) setShowForm(true)
      })
      .catch(() => setShowForm(true))
      .finally(() => setLoading(false))
  }, [])

  const handleRegister = async () => {
    if (!schoolId.trim() || !schoolName.trim()) {
      setError('School ID and School Name are required.')
      return
    }
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      await api.post('/api/schools/register', {
        school_id:   schoolId.trim().toUpperCase().replace(/\s+/g, '_'),
        school_name: schoolName.trim(),
        branch_name: branchName.trim() || null,
        address:     address.trim() || null,
        city:        city.trim() || null,
      })
      // Refetch branch info
      const res = await api.get('/api/schools/my-branch')
      setBranch(res.data.branch)
      setShowForm(false)
      setSuccess('Your school branch has been registered!')
      if (onBranchSet) onBranchSet(res.data.branch)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border p-6 flex items-center gap-3 text-slate-400">
        <div className="animate-spin text-xl">🐝</div>
        <span className="text-sm">Loading branch info...</span>
      </div>
    )
  }

  // Already registered — show info card
  if (branch && !showForm) {
    return (
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 size={18} />
            <span className="font-semibold text-sm">Your School Branch</span>
          </div>
          <p className="text-xs text-purple-200">
            You are linked to this branch. Only students from here appear in your dashboard.
          </p>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-start gap-3">
            <School size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-800 text-sm">{branch.school_name}</p>
              {branch.branch_name && <p className="text-xs text-slate-500">{branch.branch_name}</p>}
              <p className="text-xs font-mono text-slate-400 mt-0.5">ID: {branch.school_id}</p>
            </div>
          </div>

          {branch.address && (
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-600">
                {branch.address}
                {branch.city ? `, ${branch.city}` : ''}
              </p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
              <CheckCircle2 size={14} className="text-green-500" />
              <p className="text-xs text-green-600">{success}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Registration form
  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
        <div className="flex items-center gap-2 mb-1">
          <PlusCircle size={18} />
          <span className="font-semibold text-sm">Register Your School Branch</span>
        </div>
        <p className="text-xs text-purple-200">
          Add your school branch. Students will see it in their branch picker.
        </p>
      </div>

      <div className="p-5 space-y-4">
        {/* School Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
            School Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. City School"
            value={schoolName}
            onChange={e => setSchoolName(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50
                       focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
        </div>

        {/* Branch Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
            Branch Name
          </label>
          <input
            type="text"
            placeholder="e.g. Saddar Branch, Main Campus"
            value={branchName}
            onChange={e => setBranchName(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50
                       focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
          <p className="text-xs text-slate-400 mt-1">
            Leave blank if your school has only one campus.
          </p>
        </div>

        {/* School ID */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
            Branch ID <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. CITY_SADDAR (auto-uppercased)"
            value={schoolId}
            onChange={e => setSchoolId(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50
                       font-mono focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
          <p className="text-xs text-slate-400 mt-1">
            Unique identifier — no spaces. Use underscores.
          </p>
        </div>

        {/* Address */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Address
            </label>
            <input
              type="text"
              placeholder="Street, Area"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50
                         focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              City
            </label>
            <input
              type="text"
              placeholder="e.g. Rawalpindi"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50
                         focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={submitting}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white
                     font-semibold text-sm rounded-xl hover:from-purple-700 hover:to-indigo-700
                     transition-all disabled:opacity-50 disabled:cursor-not-allowed
                     shadow-sm hover:shadow-md"
        >
          {submitting ? '🐝 Registering...' : 'Register Branch'}
        </button>
      </div>
    </div>
  )
}
