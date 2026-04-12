import { useState } from 'react';
import { GraduationCap, Menu, X, LogOut, UserPlus, Key } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { navigate, currentPage, user, signOut } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: 'Home', page: 'home' as const },
    { label: 'Events', page: 'events' as const },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
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
            {user ? (
              <>
                {user.role === 'admin' && (
                  <button
                    onClick={() => navigate('admin')}
                    className="rounded-2xl border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-sm text-teal-200 hover:bg-teal-500/20 transition"
                  >
                    Admin Panel
                  </button>
                )}
                <span className="px-4 py-2 rounded-2xl bg-slate-800 text-slate-200 text-sm">
                  {user.full_name || 'Logged in'}
                </span>
                <button
                  onClick={() => signOut()}
                  className="rounded-2xl bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600 transition-flex items-center flex gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('login')}
                  className="flex items-center gap-2 rounded-2xl border border-teal-500/20 px-4 py-2 text-sm text-teal-200 hover:bg-slate-800 transition"
                >
                  <Key className="w-4 h-4" />
                  Login
                </button>
                <button
                  onClick={() => navigate('signup')}
                  className="flex items-center gap-2 rounded-2xl bg-teal-500 px-4 py-2 text-sm text-white hover:bg-teal-400 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-slate-700/50 py-3 space-y-1">
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
                  className="w-full text-left px-4 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700/50"
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate('signup'); setMobileOpen(false); }}
                  className="w-full text-left px-4 py-2.5 rounded-md text-sm font-medium text-teal-200 hover:bg-slate-700/50"
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
