import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Shield, Brain, TrendingUp, MessageSquare, AlertTriangle, HeartPulse, Flame } from 'lucide-react'
import BeeMascot from '../components/BeeMascot'
import SEO from '../components/SEO'

const problems = [
  {
    icon: <AlertTriangle size={22} className="text-rose-500" />,
    bg: 'bg-rose-50',
    title: 'Academic Stress',
    desc: 'Students struggle silently, hiding performance anxiety until it manifests as failing grades.',
  },
  {
    icon: <Brain size={22} className="text-primary-500" />,
    bg: 'bg-primary-50',
    title: 'Mental Health',
    desc: 'No real-time emotional support leaves students isolated during high-pressure school periods.',
  },
  {
    icon: <Flame size={22} className="text-orange-500" />,
    bg: 'bg-orange-50',
    title: 'Burnout',
    desc: 'Long-term performance declines often go unnoticed until standard assessments arrive too late.',
  },
]

const features = [
  {
    icon: <MessageSquare size={20} className="text-primary-600" />,
    title: 'AI Chat Support',
    desc: '24/7 empathetic listener for students to vent, reflect, and find calm.',
  },
  {
    icon: <Brain size={20} className="text-primary-600" />,
    title: 'Stress Detection',
    desc: 'Advanced NLP identifies patterns of high anxiety and emotional fatigue.',
  },
  {
    icon: <Shield size={20} className="text-primary-600" />,
    title: 'Counselor Dashboard',
    desc: 'Real-time alerts for staff when a student requires human intervention.',
  },
  {
    icon: <TrendingUp size={20} className="text-primary-600" />,
    title: 'Academic Improvement',
    desc: 'Correlate emotional well-being with grades to unlock student potential.',
  },
]

const inAction = [
  { icon: <CheckCircle2 size={16} className="text-primary-600" />, text: 'Real-time sentiment heatmaps' },
  { icon: <CheckCircle2 size={16} className="text-primary-600" />, text: 'Automated intervention alerts' },
  { icon: <CheckCircle2 size={16} className="text-primary-600" />, text: 'Student privacy-first architecture' },
]

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <SEO
        path="/"
        title="AI-Powered Student Wellness Companion"
        description="BuddyBee AI helps schools detect student stress early, provide 24/7 empathetic AI chat support, and give counselors real-time wellbeing insights."
      />
      {/* Hero */}
      <section className="relative pt-28 pb-24 px-4 overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50">
        {/* Background decoration */}
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-primary-100/40 blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-blue-100/40 blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-up">
            <div className="section-label mb-6">The Future of School Wellness 🐝</div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              AI That Cares About{' '}
              <span className="gradient-text">Student Wellness</span> 🐝
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-lg">
              BuddyBee AI helps schools detect stress, support students, and improve academic performance through empathetic AI conversations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-primary text-base">
                Request School Demo
              </Link>
              <Link to="/demo" className="btn-secondary text-base">
                See How It Works
              </Link>
            </div>
          </div>

          {/* Chat preview */}
          <div className="relative animate-fade-in animate-delay-300">
            <div className="relative">
              <BeeMascot size="xl" className="absolute -top-8 right-8 z-10" />
              <div className="card rounded-3xl overflow-hidden shadow-2xl">
                <div className="bg-slate-900 p-4 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center text-xs text-slate-400 font-mono">BuddyBee Chat</div>
                </div>
                <div className="p-6 bg-white space-y-4 min-h-64">
                  {/* Chat bubble from BuddyBee */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm flex-shrink-0">🐝</div>
                    <div className="bg-slate-100 rounded-2xl rounded-tl-none p-3 text-sm text-slate-700 max-w-xs">
                      Hi! I'm BuddyBee. How are you feeling about your exams today? 🌟
                    </div>
                  </div>
                  {/* Student reply */}
                  <div className="flex justify-end">
                    <div className="bg-primary-600 text-white rounded-2xl rounded-tr-none p-3 text-sm max-w-xs">
                      Honestly a bit overwhelmed. I have 3 chapters left and I don't know where to start...
                    </div>
                  </div>
                  {/* BuddyBee response */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm flex-shrink-0">🐝</div>
                    <div className="bg-slate-100 rounded-2xl rounded-tl-none p-3 text-sm text-slate-700 max-w-xs">
                      I hear you. That's a lot on your plate. Let's break it down together. Would you like to try a 2-minute "Box Calm" breathing exercise first? 🌿
                    </div>
                  </div>
                  {/* Typing indicator */}
                  <div className="flex gap-1.5 pl-11">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              </div>

              {/* Floating card */}
              <div className="absolute -left-8 bottom-16 glass shadow-card rounded-2xl p-4 max-w-52 animate-float animate-delay-500">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-700">Alert Triggered</span>
                </div>
                <p className="text-xs text-slate-600">Counselor notified for student support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title mb-3">Schools Are Missing Early Warning Signs</h2>
          <div className="w-12 h-1 bg-primary-500 rounded mb-16" />
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((p) => (
              <div key={p.title} className="card card-hover">
                <div className={`w-12 h-12 ${p.bg} rounded-xl flex items-center justify-center mb-4`}>
                  {p.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-surface-muted">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="section-title mb-4">BuddyBee AI Helps Schools<br />Support Every Student</h2>
          <p className="section-subtitle mx-auto mb-16">
            We provide the bridge between automated empathy and human intervention.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card card-hover text-left group">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-base text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* In Action */}
      <section className="py-24 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Dashboard preview */}
          <div className="rounded-3xl overflow-hidden bg-slate-800 shadow-2xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700 rounded-xl p-3">
                  <div className="text-xs text-slate-400 mb-1">Wellness Score</div>
                  <div className="text-2xl font-bold text-white">78</div>
                  <div className="text-xs text-emerald-400">↑ 12% this week</div>
                </div>
                <div className="bg-red-900/40 border border-red-700/40 rounded-xl p-3">
                  <div className="text-xs text-red-400 mb-1">Critical Alerts</div>
                  <div className="text-2xl font-bold text-white">4</div>
                  <div className="text-xs text-red-400">Needs attention</div>
                </div>
              </div>
              {/* Bar chart sim */}
              <div className="bg-slate-700 rounded-xl p-4">
                <div className="text-xs text-slate-400 mb-3">Student Stress Trends</div>
                <div className="flex items-end gap-2 h-20">
                  {[40, 55, 35, 65, 45, 70, 60].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary-500/60 rounded-t"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
              {/* Engagement */}
              <div className="bg-slate-700 rounded-xl p-4">
                <div className="text-xs text-slate-400 mb-2">Grade Engagement</div>
                <div className="flex gap-3 text-center">
                  {[['G9', '74%'], ['G10', '52%', true], ['G11', '81%']].map(([g, v, alert]) => (
                    <div key={g} className={`flex-1 rounded-lg py-2 ${alert ? 'bg-red-900/50 border border-red-700/40' : 'bg-slate-600'}`}>
                      <div className="text-xs text-slate-400">{g}</div>
                      <div className={`font-bold text-sm ${alert ? 'text-red-400' : 'text-white'}`}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-4xl font-bold text-white mb-4">BuddyBee in Action</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Experience our intuitive Chat Interface for students and powerful Admin Analytics for school administrators. Turn emotional data into actionable support strategies.
            </p>
            <ul className="space-y-3 mb-10">
              {inAction.map((item) => (
                <li key={item.text} className="flex items-center gap-3 text-slate-300">
                  {item.icon}
                  {item.text}
                </li>
              ))}
            </ul>
            <Link to="/contact" className="btn-primary">
              Request Demo <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-3xl mx-auto text-center">
          <BeeMascot size="lg" animate className="mb-6" />
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Ready to transform student wellness?
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            Join 200+ schools already using BuddyBee AI to foster a healthier learning environment.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-full hover:bg-primary-50 transition-colors shadow-lg">
              Schedule a Demo
            </Link>
            <Link to="/contact" className="border-2 border-white/40 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
