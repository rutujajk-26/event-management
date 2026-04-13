import { useState, FormEvent } from 'react';
import { AlertCircle, User, Mail, Lock, Key } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

const ADMIN_INVITE_CODE = 'ADMIN2026';

export default function SignupPage() {
  const { navigate } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim() || !collegeId.trim()) {
      setError('Please fill in your name and college ID.');
      return;
    }

    const trimmedAdminCode = adminCode.trim();
    const isAdminSignup = trimmedAdminCode.length > 0;
    if (isAdminSignup && trimmedAdminCode !== ADMIN_INVITE_CODE) {
      setError('Invalid admin code. Leave it blank for student signup.');
      return;
    }

    setLoading(true);

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      options: {
        data: {
          full_name: fullName.trim(),
          role: isAdminSignup ? 'admin' : 'student',
          college_id: collegeId.trim(),
        },
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSuccess('Account created successfully. Please check your email to verify and then sign in.');
    setFullName('');
    setEmail('');
    setPassword('');
    setCollegeId('');
    setAdminCode('');

    if (data?.user) {
      navigate('login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg bg-slate-900/95 border border-slate-800 rounded-3xl shadow-2xl p-8 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-teal-400 uppercase tracking-[0.4em] text-xs">Registration</p>
          <h1 className="mt-4 text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-slate-400 text-sm">Sign up to browse events, book tickets, or use an admin code to enable event management.</p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 text-red-300" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-100">
            {success}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <label className="block text-sm font-medium text-slate-300">
            Full Name
            <div className="mt-2 relative rounded-2xl border border-slate-700 bg-slate-950/90 focus-within:border-teal-500 transition-colors">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ayesha Patel"
                className="w-full appearance-none bg-transparent px-12 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                required
              />
            </div>
          </label>

          <label className="block text-sm font-medium text-slate-300">
            College ID
            <div className="mt-2 relative rounded-2xl border border-slate-700 bg-slate-950/90 focus-within:border-teal-500 transition-colors">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value)}
                placeholder="e.g. CS24B0101"
                className="w-full appearance-none bg-transparent px-12 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                required
              />
            </div>
          </label>

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
                placeholder="Create a strong password"
                className="w-full appearance-none bg-transparent px-12 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                required
                minLength={6}
              />
            </div>
          </label>

          <label className="block text-sm font-medium text-slate-300">
            Admin code (optional)
            <div className="mt-2 relative rounded-2xl border border-slate-700 bg-slate-950/90 focus-within:border-teal-500 transition-colors">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                type="text"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Enter admin code to register as admin"
                className="w-full appearance-none bg-transparent px-12 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-teal-500 px-4 py-3 text-white font-semibold transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-400 text-sm">
          Already a member?{' '}
          <button onClick={() => navigate('login')} className="text-teal-400 hover:text-teal-300 font-semibold">
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
}
