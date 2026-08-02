import { useAuth } from '../context/AuthContext'
import StudentDashboard from './dashboards/StudentDashboard'
import ParentDashboard from './dashboards/ParentDashboard'
import CounselorDashboard from './dashboards/CounselorDashboard'
import AdminDashboard from './dashboards/AdminDashboard'
import { Link } from 'react-router-dom'

const ROLE_MAP = {
  student:   StudentDashboard,
  parent:    ParentDashboard,
  counselor: CounselorDashboard,
  admin:     AdminDashboard,
}

export default function Dashboard() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <div className="text-6xl">🔒</div>
        <h2 className="font-display text-xl font-bold text-slate-900">Session expired</h2>
        <p className="text-slate-500 text-sm">Please sign in to access your dashboard.</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    )
  }

  const RoleDashboard = ROLE_MAP[user.role] ?? AdminDashboard
  return <RoleDashboard />
}
