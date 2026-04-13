import { useState } from 'react';
import { GraduationCap, Menu, X, LogOut, UserPlus, Key, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { navigate, currentPage, user, signOut, theme, toggleTheme } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: 'Home', page: 'home' as const },
    { label: 'Events', page: 'events' as const },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b ${theme === 'dark' ? 'bg-slate-900/95 border-slate-700/50' : 'bg-white/95 border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 group"
          >
            <div className="p-1.5 bg-teal-500 rounded-lg group-hover:bg-teal-400 transition-colors">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Campus<span className="text-teal-400">Tix</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {links.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => navigate(page)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'text-teal-400 bg-teal-400/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`rounded-2xl border px-3 py-2 text-sm transition ${
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <button
                    onClick={() => navigate('admin')}
                    className={`hero-button rounded-3xl px-4 py-2 text-sm font-semibold transition-all ${
                      theme === 'dark'
                        ? 'bg-teal-500 text-slate-950 shadow-teal-500/30 hover:bg-teal-400'
                        : 'bg-teal-500 text-white shadow-teal-500/25 hover:bg-teal-400'
                    }`}
                  >
                    Admin Panel
                  </button>
                )}
                <span className={`px-4 py-2 rounded-2xl text-sm ${theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-900'}`}>
                  {user.full_name || 'Logged in'}
                </span>
                <button
                  onClick={() => signOut()}
                  className={`rounded-2xl px-4 py-2 text-sm transition flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-slate-700 text-white hover:bg-slate-600'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('login')}
                  className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm transition ${
                    theme === 'dark'
                      ? 'border-teal-500/20 text-teal-200 hover:bg-slate-800'
                      : 'border-teal-500/20 text-teal-700 hover:bg-slate-100'
                  }`}
                >
                  <Key className="w-4 h-4" />
                  Login
                </button>
                <button
                  onClick={() => navigate('signup')}
                  className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm transition ${
                    theme === 'dark'
                      ? 'border-teal-500/20 text-teal-200 hover:bg-slate-800'
                      : 'border-teal-500/20 text-teal-700 hover:bg-slate-100'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 transition ${theme === 'dark' ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'}`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className={`md:hidden py-3 space-y-1 ${theme === 'dark' ? 'border-t border-slate-700/50 bg-slate-950' : 'border-t border-slate-200 bg-white'}`}>
            {links.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => { navigate(page); setMobileOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'text-teal-400 bg-teal-400/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {label}
              </button>
            ))}
            {user ? (
              <>
                {user.role === 'admin' && (
                  <button
                    onClick={() => { navigate('admin'); setMobileOpen(false); }}
                    className="w-full text-left px-4 py-2.5 rounded-md text-sm font-medium text-teal-200 hover:bg-slate-700/50"
                  >
                    Admin Panel
                  </button>
                )}
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="w-full text-left px-4 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700/50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { navigate('login'); setMobileOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition ${theme === 'dark' ? 'text-slate-300 hover:bg-slate-700/50' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate('signup'); setMobileOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition ${theme === 'dark' ? 'text-teal-200 hover:bg-slate-700/50' : 'text-teal-700 hover:bg-slate-100'}`}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
