import { useEffect, useState } from 'react';
import { ArrowRight, Ticket, Star, Shield, Zap, Users, Calendar, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchEvents } from '../lib/api';
import { Event } from '../types';

const stats = [
  { icon: Calendar, label: 'Events This Semester', value: '24+' },
  { icon: Users, label: 'Students Registered', value: '8,500+' },
  { icon: Ticket, label: 'Tickets Booked', value: '32,000+' },
  { icon: TrendingUp, label: 'Satisfaction Rate', value: '98%' },
];

const features = [
  {
    icon: Zap,
    title: 'Instant Booking',
    desc: 'Book your tickets in under 2 minutes. Receive instant confirmation via email.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    desc: 'Your transactions are protected with bank-grade security and encryption.',
  },
  {
    icon: Star,
    title: 'Premium Experience',
    desc: 'Priority entry, reserved seating, and exclusive access for ticket holders.',
  },
];

export default function HomePage() {
  const { navigate, setSelectedEvent, setLoginRole, user } = useApp();
  const [featured, setFeatured] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginOptions, setShowLoginOptions] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await fetchEvents();
        if (active) {
          setFeatured(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Unable to load featured events:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    const interval = window.setInterval(load, 8000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const handleBook = (event: Event) => {
    setSelectedEvent(event);
    navigate('booking');
  };

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-teal-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 border border-teal-500/30 rounded-full text-teal-300 text-sm font-medium mb-8">
              <Star className="w-4 h-4 fill-teal-400 text-teal-400" />
              The #1 College Event Platform
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6">
              Your Campus.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                Your Events.
              </span>
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl">
              Discover, manage, and book dynamic campus events from a single dashboard.
              Admins publish schedules and students get live updates instantly.
            </p>

            <div className="flex flex-wrap gap-4">
              {user ? (
                user.role === 'admin' ? (
                  <button
                    onClick={() => navigate('admin')}
                    className="flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-xl font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-teal-500/30 active:scale-95"
                  >
                    Manage Events
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('events')}
                    className="flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-xl font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-teal-500/30 active:scale-95"
                  >
                    View Upcoming Events
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )
              ) : (
                <>
                  <button
                    onClick={() => setShowLoginOptions(true)}
                    className="flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-xl font-semibold text-lg transition-all hover:shadow-2xl hover:shadow-teal-500/30 active:scale-95"
                  >
                    Access CampusTix
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate('events')}
                    className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-semibold text-lg transition-all backdrop-blur-sm active:scale-95"
                  >
                    Browse Events
                  </button>
                </>
              )}
            </div>

            {!user && showLoginOptions && (
              <div className="mt-6 grid gap-3 sm:grid-cols-3 max-w-2xl">
                <button
                  onClick={() => {
                    setLoginRole('student');
                    navigate('login');
                  }}
                  className="w-full rounded-2xl bg-slate-800/90 px-5 py-4 text-left text-white transition hover:bg-slate-700"
                >
                  <p className="text-sm uppercase tracking-[0.25em] text-teal-300">Student</p>
                  <p className="mt-2 text-lg font-semibold">Login</p>
                  <p className="mt-1 text-sm text-slate-400">Browse and book events with your student account.</p>
                </button>
                <button
                  onClick={() => {
                    setLoginRole('admin');
                    navigate('login');
                  }}
                  className="w-full rounded-2xl bg-slate-800/90 px-5 py-4 text-left text-white transition hover:bg-slate-700"
                >
                  <p className="text-sm uppercase tracking-[0.25em] text-teal-300">Admin</p>
                  <p className="mt-2 text-lg font-semibold">Login</p>
                  <p className="mt-1 text-sm text-slate-400">Manage schedules, publish events, and review bookings.</p>
                </button>
                <button
                  onClick={() => {
                    setShowLoginOptions(false);
                    navigate('signup');
                  }}
                  className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/90 px-5 py-4 text-left text-white transition hover:bg-slate-900"
                >
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">New account</p>
                  <p className="mt-2 text-lg font-semibold">Sign Up</p>
                  <p className="mt-1 text-sm text-slate-500">Register as a student or request admin access with the code.</p>
                </button>
              </div>
            )}

            {!user && (
              <p className="mt-4 text-sm text-teal-200 max-w-2xl">
                Admins: sign up with code <span className="font-semibold text-white">ADMIN2026</span>, then use the Admin Login option above.
              </p>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-teal-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Upcoming</p>
              <h2 className="text-4xl font-bold text-gray-900">Featured Events</h2>
            </div>
            <button
              onClick={() => navigate('events')}
              className="hidden sm:flex items-center gap-2 text-teal-600 font-semibold hover:gap-3 transition-all"
            >
              View All Events <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading featured events..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((event) => (
                <EventCard key={event.id} event={event} onBook={handleBook} />
              ))}
            </div>
          )}

          <div className="sm:hidden mt-8 text-center">
            <button
              onClick={() => navigate('events')}
              className="inline-flex items-center gap-2 text-teal-600 font-semibold"
            >
              View All Events <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Why CampusTix</p>
            <h2 className="text-4xl font-bold text-gray-900">Designed for students</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-teal-600 to-cyan-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to experience campus life?
          </h2>
          <p className="text-teal-100 text-lg mb-8">
            Hundreds of events happening this semester. Grab your tickets before they sell out.
          </p>
          <button
            onClick={() => navigate('events')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 rounded-xl font-bold text-lg hover:shadow-2xl transition-all active:scale-95"
          >
            Browse All Events <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
