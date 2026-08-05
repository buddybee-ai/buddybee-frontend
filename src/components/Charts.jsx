import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'

// ── Design tokens ─────────────────────────────────────────────────
const COLORS = {
  primary: '#5c5ce8',
  blue:    '#3b82f6',
  green:   '#10b981',
  orange:  '#f97316',
  red:     '#ef4444',
  purple:  '#8b5cf6',
  yellow:  '#f59e0b',
  teal:    '#14b8a6',
  pink:    '#ec4899',
}

const TOOLTIP_STYLE = {
  backgroundColor: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  fontSize: '12px',
  fontFamily: 'DM Sans, sans-serif',
}

const AXIS_STYLE = { fontSize: 11, fill: '#94a3b8', fontFamily: 'DM Sans, sans-serif' }

function ChartWrapper({ title, subtitle, children, action, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-display font-bold text-slate-900 text-sm">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  )
}

function EmptyState({ message = 'No data yet — start chatting or log a mood check-in!' }) {
  return (
    <div className="flex flex-col items-center justify-center h-[180px] text-slate-400">
      <div className="text-3xl mb-2">📊</div>
      <p className="text-xs text-center max-w-[220px]">{message}</p>
    </div>
  )
}

// ── Mood Area Chart ───────────────────────────────────────────────
// Backend sends: [{day: "Mon", value: 3.5}, ...]
export function MoodAreaChart({ data = [], delay = 0 }) {
  if (!data || data.length === 0) {
    return (
      <ChartWrapper title="Mood Trend" subtitle="7-day mood check-in average" delay={delay}>
        <EmptyState message="No mood check-ins yet. Log your first mood to see trends!" />
      </ChartWrapper>
    )
  }
  return (
    <ChartWrapper title="Mood Trend" subtitle="7-day mood check-in average" delay={delay}>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.2} />
              <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="day" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} domain={[1, 5]} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
          <Area type="monotone" dataKey="value" name="Mood" stroke={COLORS.blue} strokeWidth={2.5} fill="url(#moodGrad)" dot={{ r: 3, fill: COLORS.blue }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

// ── Stress / Risk Trend Bar Chart ────────────────────────────────
// Backend sends: [{day: "Mon", value: 30}, ...]
export function WeeklyStressChart({ data = [], delay = 0 }) {
  if (!data || data.length === 0) {
    return (
      <ChartWrapper title="Risk Trend" subtitle="7-day average risk score" delay={delay}>
        <EmptyState message="No conversations yet. Chat with BuddyBee to see risk analysis." />
      </ChartWrapper>
    )
  }
  return (
    <ChartWrapper title="Risk Trend" subtitle="7-day average risk score" delay={delay}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="day" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="value" name="Risk Score" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.value >= 60 ? COLORS.red : entry.value >= 30 ? COLORS.yellow : COLORS.green} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

// ── Behavioral Trends Bar Chart ──────────────────────────────────
// Backend sends: [{name: "Mood", value: 65}, {name: "Emotional Stability", value: 58}, ...]
export function BehavioralTrendsChart({ data = [], delay = 0 }) {
  if (!data || data.length === 0) {
    return (
      <ChartWrapper title="Wellbeing Indicators" subtitle="Aggregated student wellbeing" delay={delay}>
        <EmptyState message="Wellbeing data will appear once students start chatting." />
      </ChartWrapper>
    )
  }
  return (
    <ChartWrapper title="Wellbeing Indicators" subtitle="Aggregated student wellbeing" delay={delay}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: '#f8fafc' }} formatter={(v) => [`${v}/100`]} />
          <Bar dataKey="value" name="Score" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.value >= 70 ? COLORS.green : entry.value >= 40 ? COLORS.yellow : COLORS.red} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

// ── Risk Distribution Pie Chart ───────────────────────────────────
const RADIAN = Math.PI / 180
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  if (percent < 0.06) return null
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function RiskDistributionChart({ data = [], delay = 0 }) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0)
  if (!data.length || total === 0) {
    return (
      <ChartWrapper title="Risk Distribution" subtitle="Current student population" delay={delay}>
        <EmptyState message="No student data available yet." />
      </ChartWrapper>
    )
  }
  const colored = data.map(d => ({
    ...d,
    color: d.color || (d.name === 'High' ? COLORS.red : d.name === 'Medium' ? COLORS.yellow : COLORS.green),
  }))
  return (
    <ChartWrapper title="Risk Distribution" subtitle="Current student population" delay={delay}>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={colored} cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false} label={renderLabel}>
              {colored.map((entry, i) => (
                <Cell key={i} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v} students`]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 flex-shrink-0">
          {colored.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-slate-600">{d.name}</span>
              <span className="text-xs font-bold text-slate-900 ml-auto pl-2">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartWrapper>
  )
}

// ── Platform Usage Area Chart ─────────────────────────────────────
export function PlatformUsageChart({ data = [], delay = 0 }) {
  if (!data || data.length === 0) {
    return (
      <ChartWrapper title="Platform Usage" subtitle="Sessions, chats & alerts over time" delay={delay}>
        <EmptyState message="Platform usage data will appear as students use BuddyBee." />
      </ChartWrapper>
    )
  }
  return (
    <ChartWrapper title="Platform Usage" subtitle="Sessions, chats & alerts over time" delay={delay}>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2} />
              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="chatGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.2} />
              <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="sessions" name="Sessions" stroke={COLORS.primary} strokeWidth={2.5} fill="url(#sessGrad)" dot={false} />
          <Area type="monotone" dataKey="chats" name="AI Chats" stroke={COLORS.green} strokeWidth={2.5} fill="url(#chatGrad)" dot={false} />
          <Bar dataKey="alerts" name="Alerts" fill={COLORS.red} opacity={0.7} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

// ── Engagement by Grade Bar Chart ─────────────────────────────────
export function GradeEngagementChart({ data = [], delay = 0 }) {
  if (!data || data.length === 0) {
    return (
      <ChartWrapper title="Engagement by Grade" subtitle="Platform interaction rate this month" delay={delay}>
        <EmptyState message="Grade engagement data not available yet." />
      </ChartWrapper>
    )
  }
  return (
    <ChartWrapper title="Engagement by Grade" subtitle="Platform interaction rate this month" delay={delay}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="grade" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: '#f8fafc' }} formatter={(v) => [`${v}%`]} />
          <Bar dataKey="engagement" name="Engagement" radius={[6, 6, 0, 0]}
            fill={COLORS.primary}
            label={{ position: 'top', fontSize: 10, fill: '#64748b', formatter: (v) => `${v}%` }}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.engagement < 60 ? COLORS.red : entry.engagement >= 90 ? COLORS.green : COLORS.primary} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

// ── Counselor Weekly Analytics ────────────────────────────────────
// Backend sends: [{day: "Mon", value: 12}, ...] (real message counts)
export function CounselorWeeklyChart({ data = [], delay = 0 }) {
  if (!data || data.length === 0) {
    return (
      <ChartWrapper title="Weekly Student Activity" subtitle="Student messages per day (last 7 days)" delay={delay}>
        <EmptyState message="No student activity recorded this week yet." />
      </ChartWrapper>
    )
  }
  return (
    <ChartWrapper title="Weekly Student Activity" subtitle="Student messages per day (last 7 days)" delay={delay}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="day" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="value" name="Messages" fill={COLORS.primary} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

// ── Radar wellness chart ──────────────────────────────────────────
// Backend sends: [{subject: "Mood", A: 78}, {subject: "Emotional Stability", A: 60}, ...]
export function WellnessRadarChart({ data = [], delay = 0 }) {
  if (!data || data.length === 0) {
    return (
      <ChartWrapper title="Wellness Dimensions" subtitle="Holistic student wellness breakdown" delay={delay}>
        <EmptyState message="Wellness data will build as you chat and check in." />
      </ChartWrapper>
    )
  }
  return (
    <ChartWrapper title="Wellness Dimensions" subtitle="Holistic student wellness breakdown" delay={delay}>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
          <Radar name="Score" dataKey="A" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.15} strokeWidth={2} dot={{ r: 3, fill: COLORS.primary }} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

// ── Emotion Distribution Pie Chart ───────────────────────────────
// Backend sends: [{name: "Hopeful", value: 5}, {name: "Frustrated", value: 3}, ...]
const EMO_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16']
export function EmotionDistributionChart({ data = [], delay = 0 }) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0)
  if (!data.length || total === 0) {
    return (
      <ChartWrapper title="Emotion Distribution" subtitle="Emotions detected in conversations" delay={delay}>
        <EmptyState message="Chat with BuddyBee to see your emotion breakdown." />
      </ChartWrapper>
    )
  }
  return (
    <ChartWrapper title="Emotion Distribution" subtitle="Emotions detected in conversations" delay={delay}>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="60%" height={180}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={75} dataKey="value" labelLine={false}
              label={renderLabel}>
              {data.map((_, i) => (
                <Cell key={i} fill={EMO_COLORS[i % EMO_COLORS.length]} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-1.5 flex-shrink-0">
          {data.slice(0, 6).map((d, i) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: EMO_COLORS[i % EMO_COLORS.length] }} />
              <span className="text-xs text-slate-600">{d.name}</span>
              <span className="text-xs font-bold text-slate-900 ml-auto pl-2">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartWrapper>
  )
}

// ── Conversation Activity Bar Chart ──────────────────────────────
// Backend sends: [{day: "Mon", value: 8}, ...]
export function ConversationActivityChart({ data = [], delay = 0 }) {
  if (!data || data.length === 0) {
    return (
      <ChartWrapper title="Conversation Activity" subtitle="Messages per day (last 7 days)" delay={delay}>
        <EmptyState message="Start chatting to see your activity trends." />
      </ChartWrapper>
    )
  }
  return (
    <ChartWrapper title="Conversation Activity" subtitle="Messages per day (last 7 days)" delay={delay}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="day" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="value" name="Messages" fill={COLORS.purple} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

// ── Check-in History Chart ───────────────────────────────────────
// Backend sends: [{date: "2026-08-01", mood: 3.5, checkins: 2}, ...]
export function CheckinHistoryChart({ data = [], delay = 0 }) {
  if (!data || data.length === 0) {
    return (
      <ChartWrapper title="Check-in History" subtitle="Mood scores over last 14 days" delay={delay}>
        <EmptyState message="Log mood check-ins to build your history." />
      </ChartWrapper>
    )
  }
  const shortened = data.map(d => ({ ...d, date: d.date?.slice(5) || d.date }))
  return (
    <ChartWrapper title="Check-in History" subtitle="Mood scores over last 14 days" delay={delay}>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={shortened} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="checkinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.teal} stopOpacity={0.2} />
              <stop offset="95%" stopColor={COLORS.teal} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} domain={[1, 5]} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Area type="monotone" dataKey="mood" name="Mood" stroke={COLORS.teal} strokeWidth={2.5}
            fill="url(#checkinGrad)" dot={{ r: 3, fill: COLORS.teal }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}
