import { Link } from 'react-router-dom'

const footerLinks = {
  Product: [
    { label: 'Features', to: '/features' },
    { label: 'Schools', to: '/schools' },
    { label: 'Try Demo', to: '/demo' },
    { label: 'Dashboard', to: '/dashboard' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Blog', to: '#' },
    { label: 'Careers', to: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '#' },
    { label: 'Terms of Service', to: '#' },
    { label: 'HIPAA Compliance', to: '#' },
    { label: 'Security', to: '#' },
  ],
  Community: [
    { label: 'Twitter', to: '#' },
    { label: 'LinkedIn', to: '#' },
    { label: 'Instagram', to: '#' },
    { label: 'Support', to: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-white mb-4">
              <span className="text-2xl">🐝</span>
              <span>BuddyBee AI</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
              Nurturing student minds with supportive, AI-powered conversations. Empowering educators with data-driven insights.
            </p>
            <p className="text-xs text-slate-600 mt-6">© 2024 BuddyBee AI. All rights reserved.</p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-white text-sm mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-500 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            FERPA & HIPAA compliant · Student privacy-first architecture
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <span>Made with</span>
            <span className="text-yellow-500">💛</span>
            <span>for student wellness</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
