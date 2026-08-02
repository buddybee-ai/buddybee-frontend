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

// ── Mood Area Chart ───────────────────────────────────────────────
const moodData = [
  { day: 'Mon', mood: 72, stress: 45 },
  { day: 'Tue', mood: 65, stress: 58 },
  { day: 'Wed', mood: 58, stress: 72 },
  { day: 'Thu', mood: 70, stress: 50 },
  { day: 'Fri', mood: 80, stress: 38 },
  { day: 'Sat', mood: 85, stress: 30 },
  { day: 'Sun', mood: 78, stress: 35 },
]

export function MoodAreaChart({ data = moodData, delay = 0 }) {
  return (
    <ChartWrapper title="Mood & Stress Trends" subtitle="7-day rolling average" delay={delay}>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.2} />
              <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.orange} stopOpacity={0.2} />
              <stop offset="95%" stopColor={COLORS.orange} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="day" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          <Area type="monotone" dataKey="mood" name="Mood" stroke={COLORS.blue} strokeWidth={2.5} fill="url(#moodGrad)" dot={{ r: 3, fill: COLORS.blue }} activeDot={{ r: 5 }} />
          <Area type="monotone" dataKey="stress" name="Stress" stroke={COLORS.orange} strokeWidth={2.5} fill="url(#stressGrad)" dot={{ r: 3, fill: COLORS.orange }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

// ── Weekly Stress Bar Chart ───────────────────────────────────────
const weeklyStressData = [
  { week: 'Wk 1', low: 30, medium: 45, high: 25 },
  { week: 'Wk 2', low: 35, medium: 40, high: 25 },
  { week: 'Wk 3', low: 25, medium: 50, high: 25 },
  { week: 'Wk 4', low: 40, medium: 38, high: 22 },
  { week: 'Wk 5', low: 45, medium: 35, high: 20 },
  { week: 'Wk 6', low: 50, medium: 32, high: 18 },
]

export function WeeklyStressChart({ data = weeklyStressData, delay = 0 }) {
  return (
    <ChartWrapper title="Weekly Stress Analysis" subtitle="Distribution across stress levels" delay={delay}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="week" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: '#f8fafc' }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="low" name="Low" stackId="a" fill={COLORS.green} radius={[0, 0, 0, 0]} />
          <Bar dataKey="medium" name="Medium" stackId="a" fill={COLORS.yellow} />
          <Bar dataKey="high" name="High" stackId="a" fill={COLORS.red} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

// ── Behavioral Trends Line Chart ──────────────────────────────────
const behavioralData = [
  { month: 'Oct', engagement: 75, focus: 68, social: 80 },
  { month: 'Nov', engagement: 72, focus: 70, social: 75 },
  { month: 'Dec', engagement: 60, focus: 62, social: 65 },
  { month: 'Jan', engagement: 65, focus: 68, social: 70 },
  { month: 'Feb', engagement: 70, focus: 72, social: 73 },
  { month: 'Mar', engagement: 78, focus: 75, social: 78 },
  { month: 'Apr', engagement: 74, focus: 73, social: 76 },
]

export function BehavioralTrendsChart({ data = behavioralData, delay = 0 }) {
  return (
    <ChartWrapper title="Behavioral Trends" subtitle="Monthly engagement, focus & social scores" delay={delay}>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} domain={[40, 100]} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: '#e2e8f0' }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="engagement" name="Engagement" stroke={COLORS.primary} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="focus" name="Focus" stroke={COLORS.green} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="social" name="Social" stroke={COLORS.purple} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

// ── Risk Distribution Pie Chart ───────────────────────────────────
const riskDistData = [
  { name: 'Low Risk', value: 58, color: COLORS.green },
  { name: 'Medium Risk', value: 28, color: COLORS.yellow },
  { name: 'High Risk', value: 10, color: COLORS.orange },
  { name: 'Critical', value: 4, color: COLORS.red },
]

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

export function RiskDistributionChart({ data = riskDistData, delay = 0 }) {
  return (
    <ChartWrapper title="Risk Distribution" subtitle="Current student population" delay={delay}>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" labelLine={false} label={renderLabel}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v} students`]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 flex-shrink-0">
          {data.map((d) => (
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
const platformData = [
  { date: 'Apr 1', sessions: 220, chats: 180, alerts: 12 },
  { date: 'Apr 3', sessions: 280, chats: 210, alerts: 18 },
  { date: 'Apr 5', sessions: 250, chats: 195, alerts: 15 },
  { date: 'Apr 7', sessions: 320, chats: 265, alerts: 22 },
  { date: 'Apr 9', sessions: 300, chats: 240, alerts: 19 },
  { date: 'Apr 11', sessions: 360, chats: 290, alerts: 25 },
  { date: 'Apr 13', sessions: 340, chats: 275, alerts: 20 },
]

export function PlatformUsageChart({ data = platformData, delay = 0 }) {
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
const gradeEngagementData = [
  { grade: 'G7', engagement: 92 },
  { grade: 'G8', engagement: 88 },
  { grade: 'G9', engagement: 74 },
  { grade: 'G10', engagement: 52 },
  { grade: 'G11', engagement: 81 },
  { grade: 'G12', engagement: 95 },
]

export function GradeEngagementChart({ data = gradeEngagementData, delay = 0 }) {
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
const counselorWeeklyData = [
  { day: 'Mon', sessions: 8, interventions: 2, resolved: 1 },
  { day: 'Tue', sessions: 12, interventions: 3, resolved: 2 },
  { day: 'Wed', sessions: 10, interventions: 4, resolved: 3 },
  { day: 'Thu', sessions: 15, interventions: 2, resolved: 2 },
  { day: 'Fri', sessions: 9, interventions: 1, resolved: 1 },
]

export function CounselorWeeklyChart({ data = counselorWeeklyData, delay = 0 }) {
  return (
    <ChartWrapper title="Weekly Activity Analytics" subtitle="Sessions, interventions & resolutions" delay={delay}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="day" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: '#f8fafc' }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="sessions" name="Sessions" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
          <Bar dataKey="interventions" name="Interventions" fill={COLORS.orange} radius={[4, 4, 0, 0]} />
          <Bar dataKey="resolved" name="Resolved" fill={COLORS.green} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  )
}

// ── Radar wellness chart ──────────────────────────────────────────
const radarData = [
  { subject: 'Mood', A: 78, fullMark: 100 },
  { subject: 'Focus', A: 65, fullMark: 100 },
  { subject: 'Sleep', A: 72, fullMark: 100 },
  { subject: 'Social', A: 80, fullMark: 100 },
  { subject: 'Energy', A: 70, fullMark: 100 },
  { subject: 'Motivation', A: 62, fullMark: 100 },
]

export function WellnessRadarChart({ data = radarData, delay = 0 }) {
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
