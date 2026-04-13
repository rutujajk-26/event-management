import { useEffect, useState } from 'react';
import { ArrowRight, Ticket, Star, Shield, Zap, Users, Calendar, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchEvents } from '../lib/api';
import { Event } from '../types';

const stats = [
  {
    icon: Calendar,
    label: 'Events This Semester',
    value: '24+',
    summary: 'A full season of campus events—from workshops to concerts, the calendar is packed and engaging.',
    points: [
      '12 technical workshops and maker sessions',
      '6 cultural nights and live performances',
      '4 career networking mixers',
      '2 flagship speaker series',
    ],
  },
  {
    icon: Users,
    label: 'Students Registered',
    value: '8,500+',
    summary: 'Thousands of students have signed up, building strong attendance momentum across campus.',
    points: [
      '72% participation rate among active students',
      '45% growth in registrations vs. last term',
      'Top groups: arts, engineering, entrepreneurship',
      'Strong adoption among freshman and sophomore cohorts',
    ],
  },
  {
    icon: Ticket,
    label: 'Tickets Booked',
    value: '32,000+',
    summary: 'Ticket demand remains high, with most events filling quickly and repeat attendees rising.',
    points: [
      '18% month-over-month booking growth',
      'Top sellers: career fair and live concert',
      'Average purchase time under 3 minutes',
      '90% of events hit 70% capacity before event day',
    ],
  },
  {
    icon: TrendingUp,
    label: 'Satisfaction Rate',
    value: '98%',
    summary: 'Students love the experience, giving our events exceptional feedback across every category.',
    points: [
      '97% positive reviews on mobile booking',
      '94% satisfaction with event organization',
      'Top ratings for safety and convenience',
      'Trusted by campus leadership as the event platform of choice',
    ],
  },
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
  const { navigate, setSelectedEvent, setLoginRole, user, theme, eventRefreshCounter } = useApp();
  const [featured, setFeatured] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [selectedStat, setSelectedStat] = useState(stats[0].label);
  const [detailEvent, setDetailEvent] = useState<Event | null>(null);

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
  }, [eventRefreshCounter]);

  const activeStat = stats.find((item) => item.label === selectedStat) ?? stats[0];
  const isDark = theme === 'dark';
  const sectionBg = isDark ? 'bg-slate-950' : 'bg-slate-50';
  const cardBg = isDark ? 'bg-slate-900/90 border-slate-800/80' : 'bg-white border-gray-100';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

  const handleBook = (event: Event) => {
    setSelectedEvent(event);
    navigate('booking');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <section className={`relative min-h-[92vh] flex items-center overflow-hidden ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950' : 'bg-gradient-to-br from-slate-950/5 via-slate-100/70 to-cyan-100'}`}>
        <div className="absolute inset-0 opacity-90">
          <div className="absolute top-16 left-16 w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl hero-blob" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-16 right-10 w-96 h-96 bg-teal-400/25 rounded-full blur-3xl hero-blob-slow" style={{ animationDelay: '1.1s' }} />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-sky-300/20 rounded-full blur-3xl hero-float" style={{ animationDelay: '0.3s' }} />
          <div className="absolute bottom-24 left-1/3 w-56 h-56 bg-emerald-300/15 rounded-full blur-3xl hero-float" style={{ animationDelay: '0.8s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <h1 className={`text-6xl sm:text-7xl lg:text-[5rem] font-extrabold tracking-tight leading-[0.95] mb-6 ${isDark ? 'text-white' : 'text-slate-950'}`}>
              <span className={`block text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-cyan-300 via-teal-400 to-emerald-300' : 'from-slate-800 via-cyan-500 to-teal-400'} fade-in-up hero-text-wave hero-heading-line`} style={{ animationDelay: '0.1s' }}>
                Your Campus.
              </span>
              <span className={`block text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-slate-100 via-cyan-300 to-teal-400' : 'from-slate-700 via-cyan-400 to-teal-500'} fade-in-up hero-text-wave hero-heading-line`} style={{ animationDelay: '0.2s' }}>
                Your Events.
              </span>
            </h1>

            <p className={`text-2xl leading-relaxed mb-10 max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-800'} fade-in-up`} style={{ animationDelay: '0.35s' }}>
              Discover, manage, and book vibrant campus events in one immersive dashboard experience.
            </p>

            <div className="grid gap-4 sm:grid-cols-[auto_auto] sm:items-center fade-in-up" style={{ animationDelay: '0.45s' }}>
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
                    className={`hero-button group relative overflow-hidden flex items-center gap-3 px-10 py-4 rounded-full font-semibold text-lg transition duration-300 ease-out ${isDark ? 'bg-slate-900/40 border border-cyan-300/30 text-white shadow-[0_20px_66px_-34px_rgba(56,189,248,0.55)]' : 'bg-slate-950/95 border border-slate-900/70 text-white shadow-[0_20px_66px_-34px_rgba(45,212,191,0.35)] hover:bg-slate-900'}`}
                  >
                    <span className="relative flex items-center gap-2">
                      Access CampusTix
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </button>
                  <button
                    onClick={() => navigate('events')}
                    className={`hero-button group relative overflow-hidden flex items-center gap-3 px-10 py-4 rounded-full font-semibold text-lg transition duration-300 ease-out ${isDark ? 'bg-slate-900/40 border border-cyan-300/30 text-white shadow-[0_20px_66px_-34px_rgba(56,189,248,0.55)]' : 'bg-slate-950/95 border border-slate-900/70 text-white shadow-[0_20px_66px_-34px_rgba(45,212,191,0.35)] hover:bg-slate-900'}`}
                  >
                    <span className="relative">Browse Events</span>
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

          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      <section className={`${sectionBg} py-14`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, label, value }) => (
              <button
                key={label}
                type="button"
                onClick={() => setSelectedStat(label)}
                className={`rounded-2xl p-6 text-left border transition duration-300 ${
                  selectedStat === label
                    ? isDark
                      ? 'border-teal-400 bg-slate-800 shadow-teal-500/20'
                      : 'border-teal-400 bg-teal-50 shadow-teal-200'
                    : isDark
                      ? 'border-slate-800/80 bg-slate-900/90 hover:border-teal-400 hover:shadow-teal-500/10'
                      : 'border-gray-200 bg-white hover:border-teal-500 hover:shadow-teal-500/10'
                }`}
              >
                <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-teal-300" />
                </div>
                <div className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</div>
              </button>
            ))}
          </div>

          <div className={`mt-10 rounded-[2rem] border p-8 shadow-2xl ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-gray-200 bg-white'}`}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-teal-300 uppercase text-xs tracking-[0.25em] font-semibold mb-2">
                  {activeStat.label}
                </p>
                <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Detailed Analytics</h2>
              </div>
              <div className={`rounded-3xl border px-4 py-3 text-sm ${isDark ? 'border-slate-800 bg-slate-950/80 text-slate-300' : 'border-gray-200 bg-slate-50 text-slate-600'}`}>
                {activeStat.summary}
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {activeStat.points.map((point) => (
                <div key={point} className={`rounded-3xl border p-5 ${isDark ? 'border-slate-800 bg-slate-950/90' : 'border-gray-200 bg-white'}`}>
                  <p className={`${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`${sectionBg} py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-teal-400 font-semibold text-sm uppercase tracking-wider mb-2">Upcoming</p>
              <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Featured Events</h2>
            </div>
            <button
              onClick={() => navigate('events')}
              className="hidden sm:flex items-center gap-2 text-teal-400 font-semibold hover:gap-3 transition-all"
            >
              View All Events <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading featured events..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((event) => (
                <EventCard key={event.id} event={event} onBook={handleBook} onView={setDetailEvent} />
              ))}
            </div>
          )}

          <div className="sm:hidden mt-8 text-center">
            <button
              onClick={() => navigate('events')}
              className="inline-flex items-center gap-2 text-teal-400 font-semibold"
            >
              View All Events <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className={`${sectionBg} py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-teal-400 font-semibold text-sm uppercase tracking-wider mb-2">Why CampusTix</p>
            <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Designed for students</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className={`rounded-2xl p-8 border shadow-sm transition-shadow hover:shadow-teal-500/10 ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-gray-200 bg-white'}`}>
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
                <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
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

      {detailEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm" onClick={() => setDetailEvent(null)}>
          <div
            className="w-full max-w-xl max-h-[80vh] overflow-hidden rounded-[1.75rem] bg-slate-950 border border-slate-800 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-40 overflow-hidden bg-slate-950">
              <img
                src={detailEvent.image_url}
                alt={detailEvent.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setDetailEvent(null)}
                className="absolute right-3 top-3 rounded-full bg-slate-900/90 p-2 text-slate-100 hover:bg-slate-800 transition"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(80vh-10rem)] p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
                <div>
                  <p className="text-teal-300 uppercase text-[10px] tracking-[0.35em] font-semibold mb-2">{detailEvent.category}</p>
                  <h2 className="text-2xl font-bold text-white">{detailEvent.title}</h2>
                  <p className="mt-3 text-slate-400">{detailEvent.description}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-slate-300">
                  {detailEvent.price === 0 ? 'Free Entry' : `₹${detailEvent.price.toFixed(0)} per ticket`}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
                  <p className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-3">Event details</p>
                  <ul className="space-y-2 text-slate-200 text-sm">
                    <li><span className="font-semibold">Date:</span> {new Date(detailEvent.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</li>
                    <li><span className="font-semibold">Time:</span> {detailEvent.time}</li>
                    <li><span className="font-semibold">Venue:</span> {detailEvent.venue}</li>
                    <li><span className="font-semibold">Organizer:</span> {detailEvent.organizer}</li>
                    <li><span className="font-semibold">Available Seats:</span> {detailEvent.available_seats}</li>
                    <li><span className="font-semibold">Category:</span> {detailEvent.category}</li>
                  </ul>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
                  <p className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-3">Booking summary</p>
                  <div className="space-y-3 text-slate-200 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Seats left</span>
                      <span className="font-semibold">{detailEvent.available_seats}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Fill rate</span>
                      <span className="font-semibold">{Math.round(((detailEvent.total_seats - detailEvent.available_seats) / detailEvent.total_seats) * 100)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total capacity</span>
                      <span className="font-semibold">{detailEvent.total_seats}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEvent(detailEvent);
                        setDetailEvent(null);
                        navigate('booking');
                      }}
                      className="w-full rounded-2xl bg-teal-500 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-400 transition"
                    >
                      Book Tickets
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
