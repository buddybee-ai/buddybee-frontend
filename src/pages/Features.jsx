import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MessageSquare, Brain, Shield, TrendingUp, Lock,
  Clock, Eye, Users, BarChart2, Zap, HeartPulse, Star
} from 'lucide-react'
import SEO from '../components/SEO'
import { Spotlight } from '../components/ui'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] } }),
}

const mainFeatures = [
  {
    icon: <MessageSquare size={28} />,
    color: 'bg-primary-100 text-primary-600',
    title: 'AI Student Chat Support',
    desc: 'Real-time conversational AI trained by clinical psychologists to provide immediate empathetic responses and coping strategies. Available 24/7 with no wait time.',
    tags: ['24/7', 'Empathetic', 'NLP-Powered'],
  },
  {
    icon: <HeartPulse size={28} />,
    color: 'bg-rose-100 text-rose-600',
    title: 'Academic Stress Guidance',
    desc: 'Personalized study plans and time management tools designed to lower student anxiety during finals. Adaptive to each student\'s learning style.',
    tags: ['Personalized', 'Adaptive', 'Evidence-Based'],
  },
  {
    icon: <Eye size={28} />,
    color: 'bg-purple-100 text-purple-600',
    title: 'Anonymous Student Mode',
    desc: 'A safe space for students to seek help without the fear of immediate judgment or identification. Incognito mode protects student privacy.',
    tags: ['Private', 'Safe', 'Anonymous'],
  },
  {
    icon: <BarChart2 size={28} />,
    color: 'bg-blue-100 text-blue-600',
    title: 'School Wellness Analytics',
    desc: 'Aggregate data that helps school leaders understand campus-wide stress trends without compromising individual privacy. Heatmaps and trend reports.',
    tags: ['Aggregate', 'Heatmaps', 'FERPA Safe'],
  },
  {
    icon: <Zap size={28} />,
    color: 'bg-orange-100 text-orange-600',
    title: 'Early Risk Detection',
    desc: 'Flags critical wellness signals to authorized school counselors for immediate human intervention. AI triages before humans step in.',
    tags: ['Real-time', 'Critical Alerts', 'Auto-Triage'],
  },
  {
    icon: <Clock size={28} />,
    color: 'bg-emerald-100 text-emerald-600',
    title: '24/7 AI Support',
    desc: 'Mental health crises don\'t keep school hours. BuddyBee is always there when students need it most — nights, weekends, holidays.',
    tags: ['Always On', 'Instant', 'Reliable'],
  },
]

const howItWorks = [
  { step: '01', title: 'Students Chat', desc: 'Students engage with BuddyBee via a secure, friendly interface anytime they feel stressed or need a listener.' },
  { step: '02', title: 'AI Analyzes Signals', desc: 'Our engine detects patterns in sentiment, stress, and wellness without compromising identity unless necessary.' },
  { step: '03', title: 'Schools Receive Insights', desc: 'Counselors get a dashboard of trend reports and alerts for students needing high-priority human care.' },
]

const specs = [
  { icon: <Shield size={18} />, label: 'FERPA & HIPAA Compliant' },
  { icon: <Lock size={18} />, label: 'End-to-End Encrypted' },
  { icon: <Clock size={18} />, label: '99.9% Uptime SLA' },
  { icon: <Brain size={18} />, label: 'GPT-4 Powered NLP' },
  { icon: <Users size={18} />, label: 'Multi-School Support' },
  { icon: <Star size={18} />, label: 'Clinically Validated' },
]

export default function Features() {
  return (
    <div className="pt-20">
      <SEO
        path="/features"
        title="Features"
        description="Explore BuddyBee AI's features: 24/7 AI chat support, real-time stress detection, counselor dashboards, and privacy-first student wellness tools."
      />
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 grid-bg mask-fade-b -z-20" />
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} className="section-label mb-6">Platform Features</motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="section-title mb-6">
            Support that{' '}
            <span className="gradient-text">scales with your students</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="section-subtitle mx-auto mb-10">
            Our AI platform provides a multi-layered approach to student wellness, from immediate chat support to deep administrative insights.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-primary">Schedule Demo</Link>
            <Link to="/demo" className="btn-secondary">Try It Free</Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto bg-white/92 backdrop-blur-sm rounded-[2.5rem] border border-white/70 shadow-2xl p-6 sm:p-10 md:p-14">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} custom={i % 3}
              >
                <Spotlight className="card card-hover group border border-slate-100 h-full rounded-2xl">
                  <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {f.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">{f.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {f.tags.map(tag => (
                      <span key={tag} className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Spotlight>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto text-center bg-white/92 backdrop-blur-sm rounded-[2.5rem] border border-white/70 shadow-2xl p-6 sm:p-10 md:p-14">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
            <h2 className="section-title mb-3">Simple, Powerful, Compassionate</h2>
            <p className="section-subtitle mx-auto mb-16">Bridging the gap between students and support systems in three steps.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map(({ step, title, desc }, i) => (
              <motion.div key={step} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} custom={i} className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white font-display font-bold text-xl flex items-center justify-center mx-auto mb-5 shadow-primary">
                  {step}
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Specs */}
      <section className="relative py-24 px-4 bg-ink-900 overflow-hidden">
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
            <h2 className="font-display text-3xl font-bold text-white mb-4">Built for Enterprise. Designed for Students.</h2>
            <p className="text-slate-400 mb-12">Security and compliance you can trust. Experience your students will love.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {specs.map(({ icon, label }, i) => (
              <motion.div
                key={label}
                initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} custom={i % 3}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors duration-300"
              >
                <div className="text-primary-400">{icon}</div>
                <span className="text-slate-300 text-sm font-medium">{label}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-12">
            <Link to="/contact" className="btn-primary">Get Started Today</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
