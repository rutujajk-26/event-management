import { useState, FormEvent } from 'react';
import { AlertCircle, Lock, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { navigate, loginRole, setLoginRole } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    if (data.user) {
      const role = (data.user.user_metadata as any)?.role || 'student';
      setLoginRole(null);
      if (role === 'admin') {
        navigate('admin');
      } else {
        navigate('events');
      }
    } else {
      setError('Unable to sign in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl p-8 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-teal-400 uppercase tracking-[0.4em] text-xs">CampusTix {loginRole ? `${loginRole.charAt(0).toUpperCase() + loginRole.slice(1)}` : 'Auth'} Portal</p>
          <h1 className="mt-4 text-3xl font-bold">
            {loginRole === 'admin' ? 'Admin Login' : loginRole === 'student' ? 'Student Login' : 'Sign in to continue'}
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            {loginRole === 'admin'
              ? 'Use your admin credentials to manage events, bookings, and schedules.'
              : loginRole === 'student'
              ? 'Login to browse events, book tickets, and manage your registration.'
              : 'Admin and student users can sign in here. Choose the appropriate login flow from the home screen.'}
          </p>
          <p className="mt-3 text-sm text-teal-200">If you want admin access, sign up with the code <span className="font-semibold text-white">ADMIN2026</span> and then log in here.</p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 text-red-300" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <label className="block text-sm font-medium text-slate-300">
            Email address
            <div className="mt-2 relative rounded-2xl border border-slate-700 bg-slate-950/90 focus-within:border-teal-500 transition-colors">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full appearance-none bg-transparent px-12 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                required
              />
            </div>
          </label>

          <label className="block text-sm font-medium text-slate-300">
            Password
            <div className="mt-2 relative rounded-2xl border border-slate-700 bg-slate-950/90 focus-within:border-teal-500 transition-colors">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full appearance-none bg-transparent px-12 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                required
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-teal-500 px-4 py-3 text-white font-semibold transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-400 text-sm">
          New student?{' '}
          <button onClick={() => navigate('signup')} className="text-teal-400 hover:text-teal-300 font-semibold">
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}
