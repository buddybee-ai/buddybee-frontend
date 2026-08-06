import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import BeeMascot from '../components/BeeMascot'
import SEO from '../components/SEO'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] } }),
}

// Photos are served from the /public folder — no import needed
const hamzaPhoto  = '/Hamza.jpg.jpg'
const dayyanPhoto = '/Dayyan.jpg.jpg'

const values = [
  { emoji: '💛', title: 'Empathy First',     desc: 'Every decision we make starts with "how does this serve the student?"' },
  { emoji: '🔒', title: 'Privacy by Design', desc: 'Student data is sacred. We build privacy in from the ground up.' },
  { emoji: '🧪', title: 'Evidence-Based',    desc: 'Our AI is validated by clinical psychologists and educational researchers.' },
  { emoji: '🌍', title: 'Equitable Access',  desc: 'Every student deserves support, regardless of zip code or income.' },
]

const founders = [
  {
    name:          'Dayyan Hassan',
    role:          'CEO & Co-founder',
    photo:         dayyanPhoto,
    gradientFrom:  '#6366f1',
    gradientTo:    '#3b82f6',
    badgeClass:    'bg-indigo-50 text-indigo-700 border-indigo-200',
    ringClass:     'ring-indigo-400',
    intro: `Dayyan is an alum of Kips College, a passionate technologist and an entrepreneur dedicated to solving real-world problems through AI. With a deep belief that mental health support should be accessible to every student, he co-founded BuddyBee AI to bridge the gap between academic pressure and emotional well-being. His vision drives the product's core mission: making empathetic AI support a standard part of every student's journey.`,
    message: `"Every student deserves a space where they feel heard — not judged. BuddyBee was built for you. Your struggles are valid, your potential is limitless, and you are never alone on this journey. We built this so that whenever you feel the weight of the world on your shoulders, there's always a friend ready to listen."`,
  },
  {
    name:          'Hamza Aziz',
    role:          'COO & Co-founder',
    photo:         hamzaPhoto,
    gradientFrom:  '#f59e0b',
    gradientTo:    '#f97316',
    badgeClass:    'bg-amber-50 text-amber-700 border-amber-200',
    ringClass:     'ring-amber-400',
    intro: `Hamza brings operational excellence and a student-first mindset to BuddyBee AI. Having navigated the pressures of academia himself, he understands what students go through — and is driven to ensure that every school has the tools to proactively support student mental wellness at scale. He oversees operations, partnerships, and the day-to-day mission of growing BuddyBee across institutions.`,
    message: `"I've seen firsthand how stress and silence can derail a brilliant mind. No student should have to figure things out alone. BuddyBee is our promise to every student: we see you, we built this for you, and we are in your corner every single day — even at 2 AM the night before your exam."`,
  },
]

export default function About() {
  return (
    <div className="pt-20">
      <SEO
        path="/about"
        title="About Us"
        description="Meet the team behind BuddyBee AI and learn our mission to make empathetic, AI-powered mental health support accessible to every student."
      />

      {/* ── Hero ── */}
      <section className="pb-16 md:pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center bg-white/92 backdrop-blur-sm rounded-[2.5rem] border border-white/70 shadow-2xl p-6 sm:p-10 md:p-14">
          <BeeMascot size="lg" className="mb-6" />
          <div className="section-label mb-6">Our Story</div>
          <h1 className="section-title mb-6">
            Built by educators. Powered by{' '}
            <span className="gradient-text">compassionate AI.</span>
          </h1>
          <p className="section-subtitle mx-auto">
            BuddyBee AI was born from a simple question: what if every student had a caring, knowledgeable friend available 24/7 to help them navigate academic pressure and emotional challenges?
          </p>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto bg-white/92 backdrop-blur-sm rounded-[2.5rem] border border-white/70 shadow-2xl p-6 sm:p-10 md:p-14">
          <h2 className="section-title text-center mb-16">Our Commitment</h2>
          <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">
            To cultivate a world where every student feels seen, heard, and supported in their journey toward mental well-being.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card border border-primary-100">
              <div className="text-primary-600 font-semibold text-sm mb-3">Our Mission</div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-4">Democratize Mental Health Support</h3>
              <p className="text-slate-500 leading-relaxed">
                To democratize access to high-quality mental health support by integrating empathetic AI technology into every educational institution, ensuring no student struggles in silence.
              </p>
            </div>
            <div className="card border border-blue-100">
              <div className="text-blue-600 font-semibold text-sm mb-3">Our Vision</div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-4">Redefine School Excellence</h3>
              <p className="text-slate-500 leading-relaxed">
                A future where the standard for school excellence includes not just academic GPA, but a robust index of emotional intelligence and student holistic health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto bg-white/92 backdrop-blur-sm rounded-[2.5rem] border border-white/70 shadow-2xl p-6 sm:p-10 md:p-14">
          <h2 className="section-title text-center mb-16">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ emoji, title, desc }, i) => (
              <motion.div key={title} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp} custom={i} className="card card-hover text-center">
                <div className="text-5xl mb-4">{emoji}</div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CO-FOUNDERS SECTION
      ══════════════════════════════════════════════ */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto bg-white/92 backdrop-blur-sm rounded-[2.5rem] border border-white/70 shadow-2xl p-6 sm:p-10 md:p-14">

          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-xs font-semibold px-4 py-1.5 rounded-full border border-primary-200 mb-5">
              🐝 The Founders
            </div>
            <h2 className="section-title mb-4">The Minds Behind BuddyBee</h2>
            <p className="section-subtitle mx-auto max-w-xl">
              Two friends who turned their own student struggles into a mission to ensure no one else ever has to face them alone.
            </p>
          </div>

          {/* Founder cards */}
          <div className="space-y-20">
            {founders.map((f, idx) => (
              <motion.div key={f.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>

                <div className={`flex flex-col gap-10 items-center ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>

                  {/* Photo + name */}
                  <div className="flex flex-col items-center gap-5 flex-shrink-0">
                    <div
                      className={`relative w-60 h-72 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-offset-4 ${f.ringClass}`}
                      style={{ boxShadow: `0 20px 60px -10px ${f.gradientFrom}40` }}
                    >
                      <img
                        src={f.photo}
                        alt={`Photo of ${f.name}`}
                        className="w-full h-full object-cover object-top"
                      />
                      {/* Bottom gradient overlay */}
                      <div
                        className="absolute inset-x-0 bottom-0 h-20"
                        style={{ background: `linear-gradient(to top, ${f.gradientFrom}88, transparent)` }}
                      />
                    </div>

                    <div className="text-center">
                      <h3 className="font-display font-bold text-2xl text-slate-900">{f.name}</h3>
                      <span className={`inline-block mt-2 text-xs font-semibold px-3.5 py-1.5 rounded-full border ${f.badgeClass}`}>
                        {f.role}
                      </span>
                    </div>
                  </div>

                  {/* Bio + message */}
                  <div className="flex-1 space-y-7">

                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">About</p>
                      <p className="text-slate-600 leading-relaxed text-[15px]">{f.intro}</p>
                    </div>

                    <div
                      className="h-px w-full rounded-full opacity-30"
                      style={{ background: `linear-gradient(to right, ${f.gradientFrom}, ${f.gradientTo})` }}
                    />

                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-3">
                        Message to Students
                      </p>
                      <blockquote className="relative pl-5">
                        <div
                          className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full"
                          style={{ background: `linear-gradient(to bottom, ${f.gradientFrom}, ${f.gradientTo})` }}
                        />
                        <p className="text-slate-700 italic leading-relaxed text-[15px] font-medium">
                          {f.message}
                        </p>
                      </blockquote>
                    </div>

                  </div>
                </div>

                {/* Separator between cards */}
                {idx < founders.length - 1 && (
                  <div className="mt-20 flex items-center gap-4">
                    <div className="flex-1 h-px bg-slate-100" />
                    <span className="text-2xl">🐝</span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>
                )}

              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 bg-primary-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">Join us in our mission</h2>
          <p className="text-primary-100 mb-8">Help us ensure no student ever has to struggle alone.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="bg-white text-primary-700 font-semibold px-8 py-3 rounded-full hover:bg-primary-50 transition-colors">
              Partner With Us
            </Link>
            <Link to="#" className="border-2 border-white/40 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
              View Careers
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
