import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { supabase } from '../lib/supabase';
import { fetchEvents } from '../lib/api';
import { Event, Category } from '../types';

const categories: Category[] = [
  'All',
  'Technology',
  'Case Studies',
  'Research',
  'Entertainment',
  'Cultural',
  'Traditional',
  'Business',
  'Arts',
  'Science',
  'General',
];

const categoryColors: Record<Category, string> = {
  All: 'bg-slate-800 text-white border-slate-800',
  Technology: 'bg-blue-600 text-white border-blue-600',
  'Case Studies': 'bg-violet-600 text-white border-violet-600',
  Research: 'bg-cyan-600 text-white border-cyan-600',
  Entertainment: 'bg-fuchsia-600 text-white border-fuchsia-600',
  Cultural: 'bg-pink-600 text-white border-pink-600',
  Traditional: 'bg-amber-600 text-white border-amber-600',
  Business: 'bg-emerald-600 text-white border-emerald-600',
  Arts: 'bg-rose-600 text-white border-rose-600',
  Science: 'bg-sky-600 text-white border-sky-600',
  General: 'bg-slate-600 text-white border-slate-600',
};

const categoryBorderInactive: Record<Category, string> = {
  All: 'border-slate-200 text-slate-600 hover:border-slate-400',
  Technology: 'border-blue-200 text-blue-600 hover:border-blue-400',
  'Case Studies': 'border-violet-200 text-violet-600 hover:border-violet-400',
  Research: 'border-cyan-200 text-cyan-600 hover:border-cyan-400',
  Entertainment: 'border-fuchsia-200 text-fuchsia-600 hover:border-fuchsia-400',
  Cultural: 'border-pink-200 text-pink-600 hover:border-pink-400',
  Traditional: 'border-amber-200 text-amber-600 hover:border-amber-400',
  Business: 'border-emerald-200 text-emerald-600 hover:border-emerald-400',
  Arts: 'border-rose-200 text-rose-600 hover:border-rose-400',
  Science: 'border-sky-200 text-sky-600 hover:border-sky-400',
  General: 'border-slate-200 text-slate-600 hover:border-slate-400',
};

export default function EventsPage() {
  const { navigate, setSelectedEvent, user } = useApp();
  const [events, setEvents] = useState<Event[]>([]);
  const [filtered, setFiltered] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<'date' | 'price_asc' | 'price_desc'>('date');
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await fetchEvents();
        if (active) {
          setEvents(data);
          setFiltered(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Unable to load events:', error);
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    const interval = window.setInterval(load, 8000);

    const onFocus = () => load();
    window.addEventListener('focus', onFocus);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setBookingCount(0);
      return;
    }

    async function loadBookingCount() {
      const { data } = await supabase.from('bookings').select('id', { count: 'exact' }).eq('college_id', user?.college_id);
      setBookingCount(data?.length ?? 0);
    }

    if (user.role === 'student') {
      loadBookingCount();
    }
  }, [user]);

  useEffect(() => {
    let result = [...events];

    if (activeCategory !== 'All') {
      result = result.filter((e) => e.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.organizer.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'date') result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);

    setFiltered(result);
  }, [events, search, activeCategory, sortBy]);

  const handleBook = (event: Event) => {
    setSelectedEvent(event);
    navigate('booking');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 pt-28 pb-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-teal-400 font-semibold text-sm uppercase tracking-wider mb-2">Discover & Book</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">All Campus Events</h1>
              <p className="text-slate-400 text-lg max-w-2xl">
                Find and book tickets for events happening across campus. Choose categories like hackathons, case studies, research, culture, entertainment, and more.
              </p>
            </div>
            {user?.role === 'student' ? (
              <div className="rounded-3xl border border-teal-500/20 bg-slate-950/70 px-5 py-4 text-teal-100">
                <p className="text-sm uppercase tracking-[0.3em] text-teal-300">Student dashboard</p>
                <p className="mt-2 text-lg font-semibold">Welcome back, {user.full_name}</p>
                <p className="mt-1 text-sm text-slate-400">You have {bookingCount} booking{bookingCount === 1 ? '' : 's'}.</p>
              </div>
            ) : user?.role === 'admin' ? (
              <button
                onClick={() => navigate('admin')}
                className="w-full sm:w-auto rounded-3xl bg-teal-500 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-400 transition"
              >
                Open Admin Panel
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, venues, organizers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="date">Sort by Date</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                activeCategory === cat
                  ? categoryColors[cat]
                  : `bg-white ${categoryBorderInactive[cat]}`
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6 gap-4 flex-col sm:flex-row">
          <p className="text-gray-500 text-sm">
            Showing <span className="font-semibold text-gray-900">{filtered.length}</span> events
            {activeCategory !== 'All' && ` in ${activeCategory}`}
            {search && ` matching "${search}"`}
          </p>
          <p className="text-sm text-slate-400">
            Categories include hackathons, workshops, case studies, research, entertainment, traditional days and more.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading events..." />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All'); }}
              className="mt-4 text-teal-600 font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} onBook={handleBook} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
