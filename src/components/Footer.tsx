import { GraduationCap, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { navigate, theme } = useApp();

  const categories = [
    'Technology',
    'Case Studies',
    'Research',
    'Entertainment',
    'Cultural',
    'Traditional',
    'Workshops',
    'Business',
    'Arts',
    'Science',
  ];

  return (
    <footer className={`${theme === 'dark' ? 'bg-slate-900 text-slate-300' : 'bg-slate-100 text-slate-800'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 bg-teal-500 rounded-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Campus<span className="text-teal-400">Tix</span>
              </span>
            </div>
            <p className={`text-sm leading-relaxed mb-5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Your one-stop platform for booking tickets to all college events. Never miss out on the campus experience.
            </p>
            <div className="flex items-center gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-slate-800 hover:bg-teal-500/20 hover:text-teal-400' : 'bg-slate-200 hover:bg-teal-500/20 hover:text-teal-500'}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home', page: 'home' as const },
                { label: 'Browse Events', page: 'events' as const },
              ].map(({ label, page }) => (
                <li key={page}>
                  <button
                    onClick={() => navigate(page)}
                    className={`transition-colors ${theme === 'dark' ? 'hover:text-teal-400 text-slate-300' : 'hover:text-teal-500 text-slate-600'}`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Event Categories</h4>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => navigate('events')}
                    className={`transition-colors ${theme === 'dark' ? 'hover:text-teal-400 text-slate-300' : 'hover:text-teal-500 text-slate-600'}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>Student Affairs Office,<br />Main Campus, Building C</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>events@campus.edu</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={`mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${theme === 'dark' ? 'border-t border-slate-700/50 text-slate-500' : 'border-t border-slate-200 text-slate-500'}`}>
          <span>© 2024 CampusTix. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-slate-300' : 'hover:text-slate-700'}`}>Privacy Policy</a>
            <a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-slate-300' : 'hover:text-slate-700'}`}>Terms of Service</a>
            <a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-slate-300' : 'hover:text-slate-700'}`}>Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
