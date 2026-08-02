# 🐝 BuddyBee AI — Production Dashboard System v2.0

A fully production-ready, role-based React dashboard system for BuddyBee AI — an AI-powered student mental health and wellness platform.

---

## 🚀 Quick Start

```bash
unzip buddybee-ai.zip
cd buddybee-ai
npm install
npm run dev
```

Open → `http://localhost:5173`

---

## 🗂 Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx          # Role-aware collapsible sidebar (Framer Motion)
│   ├── Topbar.jsx           # Topbar with notifications, search, user profile
│   ├── StatsCard.jsx        # Animated metric card (8 color variants)
│   ├── RiskIndicator.jsx    # Risk level card + RiskBadge (low/medium/high/critical)
│   ├── Charts.jsx           # All Recharts: Area, Bar, Line, Pie, Radar charts
│   ├── Navbar.jsx           # Public site navbar
│   ├── Footer.jsx           # Public site footer
│   └── BeeMascot.jsx        # Animated bee mascot
│
├── context/
│   └── AuthContext.jsx      # login(), logout(), switchRole(), localStorage persistence
│
├── layouts/
│   ├── DashboardLayout.jsx  # Sidebar + Topbar shell layout
│   └── MainLayout.jsx       # Public pages layout
│
└── pages/
    ├── Dashboard.jsx         # Role router → loads correct dashboard
    ├── dashboards/
    │   ├── StudentDashboard.jsx    # Mood check-in, wellness score, AI chat, activity
    │   ├── ParentDashboard.jsx     # Child monitoring, risk alerts, behavioral trends
    │   ├── CounselorDashboard.jsx  # Student list, interventions, risk distribution
    │   └── AdminDashboard.jsx      # District analytics, school table, system health
    ├── Home.jsx
    ├── Features.jsx
    ├── Schools.jsx
    ├── About.jsx
    ├── Contact.jsx
    ├── Demo.jsx              # Interactive AI chat demo
    ├── Login.jsx             # Role-selector login
    ├── Signup.jsx
    └── ChatPage.jsx          # Full chat interface inside dashboard
```

---

## 🎭 Role-Based Dashboard System

| Role | Dashboard | Banner Color | Key Features |
|------|-----------|-------------|--------------|
| **Student** | `StudentDashboard` | Blue | Mood check-in, wellness score, study suggestions, AI chat |
| **Parent** | `ParentDashboard` | Green | Child monitoring, risk alerts, behavioral trends, AI suggestions |
| **Counselor** | `CounselorDashboard` | Purple | Student list with risk filter, intervention alerts, weekly analytics |
| **Admin** | `AdminDashboard` | Indigo | District overview, school table, system health, platform usage |

### Switch roles during demo
The sidebar has a **"Switch Role (Demo)"** button to instantly switch between all 4 roles. Role is persisted to `localStorage`.

---

## 📊 Charts (Recharts)

| Chart | Used In |
|-------|---------|
| `MoodAreaChart` | Student — mood & stress area chart |
| `WeeklyStressChart` | Student, Parent — stacked bar |
| `BehavioralTrendsChart` | Parent, Counselor — multi-line |
| `WellnessRadarChart` | Student — polar radar |
| `RiskDistributionChart` | Counselor, Admin — donut pie |
| `CounselorWeeklyChart` | Counselor — grouped bar |
| `PlatformUsageChart` | Admin — area + bar combo |
| `GradeEngagementChart` | Admin — color-coded bar |

---

## 🛠 Tech Stack

| Technology | Version | Usage |
|-----------|---------|-------|
| React | ^18.2 | UI framework |
| React Router | ^6.22 | Client-side routing |
| Tailwind CSS | ^3.4 | Utility styling |
| Recharts | ^2.12 | Analytics charts |
| Framer Motion | ^11.0 | Animations |
| Lucide React | ^0.363 | Icons |
| Vite | ^5.1 | Build tool |

---

## 🔐 Auth System

`AuthContext.jsx` provides:
- `login(role)` — sets user + persists to localStorage
- `logout()` — clears user + localStorage  
- `switchRole(role)` — instant role switching for demo
- `user.role` — drives dashboard routing and sidebar config
- Persisted across page refresh via localStorage

---

## 🎨 Design System

- **Primary**: Indigo `#5c5ce8`
- **Font Display**: Sora (headings)
- **Font Body**: DM Sans
- **Cards**: `rounded-2xl`, `border border-slate-100`, `shadow-sm`
- **Animations**: Framer Motion entrance animations with staggered delays
- **Charts**: Custom tooltip style, gradient fills, rounded bars

---

## 🔌 Backend Integration (FastAPI)

Replace mock data in each dashboard with API calls:

```js
// Example: replace STUDENTS array in CounselorDashboard
useEffect(() => {
  fetch('/api/counselor/students', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(r => r.json())
    .then(setStudents)
}, [])
```

AuthContext `login()` is already structured to accept credentials and can be swapped for a real JWT auth call.

---

## 📦 Commands

```bash
npm install     # Install dependencies
npm run dev     # Start dev server (localhost:5173)
npm run build   # Build for production
npm run preview # Preview production build
```

---

Built with 💛 for student wellness.
