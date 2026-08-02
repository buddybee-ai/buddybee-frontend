import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, BarChart2, Shield, Brain, Clock } from 'lucide-react'
import BeeMascot from '../components/BeeMascot'
import SEO from '../components/SEO'

const stats = [
  { value: '75%', label: 'of mental health conditions begin before age 24, making schools the front line of wellness support.', source: 'WHO Research', highlight: false },
  { value: '1 in 5', label: 'Students report chronic stress and anxiety impacting their academic performance every single semester.', source: 'Global Educational Survey', highlight: true },
  { value: '60%', label: 'Reduction in crisis escalation when students have access to immediate, non-judgmental digital support tools.', source: '2022 Wellness Impact Study', highlight: false },
]

const benefits = [
  { icon: <BarChart2 size={20} className="text-primary-600" />, title: 'Real-time Insights', desc: 'Identify trends in student mood without compromising privacy.' },
  { icon: <Shield size={20} className="text-primary-600" />, title: 'Safe & Secure', desc: 'FERPA and HIPAA compliant data handling at every step.' },
  { icon: <Brain size={20} className="text-primary-600" />, title: 'Early Triage', desc: 'Flag urgent cases to counselors before they reach a boiling point.' },
  { icon: <Clock size={20} className="text-primary-600" />, title: '24/7 Availability', desc: 'Support that doesn\'t sleep, even when the campus office is closed.' },
]

const whyChoose = [
  { title: 'Built for schools', desc: 'Developed in collaboration with educational psychologists to align with school curricula and protocols.' },
  { title: 'Student-first design', desc: 'A non-clinical interface that feels like a modern app, removing the stigma of seeking help.' },
  { title: 'Privacy focused', desc: 'FERPA and HIPAA compliant data handling ensures student information remains secure and ethical.' },
  { title: 'AI-powered insights', desc: 'Move from reactive to proactive care with advanced trend analysis across your campus.' },
]

export default function Schools() {
  return (
    <div className="pt-20">
      <SEO
        path="/schools"
        title="For Schools & Districts"
        description="See how BuddyBee AI helps schools and districts move from reactive to proactive student wellness with FERPA and HIPAA compliant AI insights."
      />
      {/* Hero */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-50 via-primary-50 to-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-label mb-6">The Serene Sanctuary</div>
            <h1 className="section-title mb-6">
              The AI Companion for{' '}
              <span className="gradient-text">Mental Clarity</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              BuddyBee AI is more than just a chatbot — it is a dedicated emotional sanctuary designed for the modern educational ecosystem. We bridge the gap between academic pressure and student wellness through empathetic, real-time AI interactions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-primary">Get Started <ArrowRight size={16} /></Link>
              <Link to="#" className="btn-secondary">Read Whitepaper</Link>
            </div>
          </div>
          <div className="flex justify-center">
            <BeeMascot size="xl" className="drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Addressing the Silent Crisis</h2>
            <p className="section-subtitle mx-auto">
              The landscape of student mental health is changing. Our data-driven highlights the urgency of early intervention.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((s) => (
              <div
                key={s.value}
                className={`rounded-3xl p-8 ${s.highlight
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-50 border border-slate-100'
                }`}
              >
                <div className={`font-display text-5xl font-bold mb-4 ${s.highlight ? 'text-white' : 'text-primary-600'}`}>
                  {s.value}
                </div>
                <p className={`text-sm leading-relaxed mb-4 ${s.highlight ? 'text-primary-100' : 'text-slate-600'}`}>
                  {s.label}
                </p>
                <div className={`text-xs font-semibold uppercase tracking-widest ${s.highlight ? 'text-primary-200' : 'text-slate-400'}`}>
                  {s.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits for Educators */}
      <section className="py-24 px-4 bg-surface-muted">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((b) => (
              <div key={b.title} className="card">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-3">
                  {b.icon}
                </div>
                <h3 className="font-semibold text-sm text-slate-900 mb-1">{b.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
          <div>
            <h2 className="section-title mb-6">
              Empowering Educators with Intelligence
            </h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              We don't replace counselors; we empower them. BuddyBee AI acts as the first point of contact, providing a supportive space for students to vent, reflect, and learn coping mechanisms, while surfacing actionable data for administrative teams.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Automated administrative reporting and compliance logs',
                'Customizable school-specific resources and pathways',
                'Reduction in counselor burnout through pre-triage support',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-slate-600 text-sm">
                  <CheckCircle2 size={16} className="text-primary-600 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Why schools choose */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="section-title mb-4">
              Why schools choose <span className="gradient-text">BuddyBee</span>
            </h2>
            <div className="space-y-6 mt-8">
              {whyChoose.map(({ title, desc }) => (
                <div key={title} className="flex gap-4">
                  <CheckCircle2 size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 mb-1">{title}</div>
                    <div className="text-sm text-slate-500 leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden bg-slate-100 aspect-square flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=600&fit=crop"
                alt="Students studying"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = '<div class="flex flex-col items-center justify-center gap-4 p-12 text-center"><span class="text-8xl">🎓</span><p class="text-slate-500 font-medium">Supporting every student\'s journey</p></div>'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Ready to transform student wellness in your district?
          </h2>
          <p className="text-slate-400 mb-10">
            Join 200+ schools already using BuddyBee AI to foster a healthier learning environment.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-primary">Schedule a Demo</Link>
            <Link to="/contact" className="border border-slate-600 text-slate-300 font-semibold px-6 py-3 rounded-full hover:bg-slate-800 transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
