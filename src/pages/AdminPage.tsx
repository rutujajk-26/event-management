import { useEffect, useState, FormEvent } from 'react';
import { PlusCircle, Calendar, Clock, MapPin, DollarSign, Users, Bookmark, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Event } from '../types';
import { createEvent, deleteEvent, fetchEvents, updateEvent } from '../lib/api';

const categories = [
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

const initialForm = {
  title: '',
  description: '',
  date: '',
  time: '10:00',
  venue: '',
  category: 'Technology',
  price: 0,
  total_seats: 100,
  image_url: '',
  organizer: '',
};

export default function AdminPage() {
  const { user, navigate, eventRefreshCounter, theme } = useApp();
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState(initialForm);
  const isDark = theme === 'dark';
  const cardPanel = isDark ? 'bg-slate-900/90 border border-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-900';
  const inputClass = `mt-2 w-full rounded-2xl border px-4 py-3 text-sm focus:border-teal-500 focus:outline-none ${isDark ? 'border-slate-700 bg-slate-950/90 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'}`;
  const labelText = isDark ? 'text-slate-300' : 'text-slate-600';
  const bodyText = isDark ? 'text-slate-400' : 'text-slate-600';
  const headerText = isDark ? 'text-white' : 'text-slate-900';
  const trackBg = isDark ? 'bg-slate-800' : 'bg-slate-100';

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [originalEvent, setOriginalEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') return;

    let active = true;
    loadEvents(true);
    const interval = window.setInterval(() => {
      if (active) {
        loadEvents(false);
      }
    }, 8000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [user, eventRefreshCounter]);

  const loadEvents = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const data = await fetchEvents();
      setEvents(
        data.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
    } catch (error) {
      setMessage(`Unable to load events: ${(error as Error).message}`);
    }
    if (showLoading) {
      setLoading(false);
    }
  };

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title || !form.date || !form.venue) {
      setMessage('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      if (editingEventId && originalEvent) {
        const updatedEvent = await updateEvent(editingEventId, {
          title: form.title,
          description: form.description,
          date: form.date,
          time: form.time,
          venue: form.venue,
          category: form.category,
          price: form.price,
          total_seats: form.total_seats,
          image_url: form.image_url,
          organizer: form.organizer,
        });

        setSubmitting(false);
        setMessage('Event updated successfully and changes are now visible to students.');
        setForm(initialForm);
        setEditingEventId(null);
        setOriginalEvent(null);
        setEvents((current) =>
          current.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
        );
        return;
      }

      const createdEvent = await createEvent({
        title: form.title,
        description: form.description,
        date: form.date,
        time: form.time,
        venue: form.venue,
        category: form.category,
        price: form.price,
        total_seats: form.total_seats,
        image_url: form.image_url,
        organizer: form.organizer,
      });

      setSubmitting(false);
      setForm(initialForm);
      setMessage('Event created successfully and now visible to students.');
      setEvents((current) =>
        [createdEvent, ...current].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
    } catch (error) {
      setSubmitting(false);
      setMessage(`Unable to ${editingEventId ? 'update' : 'create'} event: ${(error as Error).message}`);
    }
  };

  const handleEdit = (eventItem: Event) => {
    setEditingEventId(eventItem.id);
    setOriginalEvent(eventItem);
    setForm({
      title: eventItem.title,
      description: eventItem.description,
      date: eventItem.date,
      time: eventItem.time,
      venue: eventItem.venue,
      category: eventItem.category,
      price: eventItem.price,
      total_seats: eventItem.total_seats,
      image_url: eventItem.image_url,
      organizer: eventItem.organizer,
    });
    setMessage('');
  };

  const cancelEdit = () => {
    setEditingEventId(null);
    setOriginalEvent(null);
    setForm(initialForm);
    setMessage('Edit cancelled. Ready to create a new event.');
  };

  const totalTicketsSold = events.reduce(
    (total, eventItem) => total + (eventItem.total_seats - eventItem.available_seats),
    0
  );

  const eventSales = events
    .map((eventItem) => ({
      ...eventItem,
      tickets_sold: eventItem.total_seats - eventItem.available_seats,
      sold_pct: eventItem.total_seats
        ? Math.round(((eventItem.total_seats - eventItem.available_seats) / eventItem.total_seats) * 100)
        : 0,
    }))
    .sort((a, b) => b.tickets_sold - a.tickets_sold);

  const handleDelete = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      setEvents((current) => current.filter((event) => event.id !== eventId));
      setMessage('Event deleted successfully.');
    } catch (error) {
      setMessage(`Unable to delete event: ${(error as Error).message}`);
    }
  };

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 py-16 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className={`text-center max-w-xl rounded-3xl border p-10 shadow-2xl ${isDark ? 'border-slate-800 bg-slate-900/95 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
          <h1 className="text-3xl font-bold mb-4">Admin access required</h1>
          <p className={`${bodyText} mb-6">Please sign in with your admin credentials to manage events.</p>
          <button
            onClick={() => navigate('login')}
            className="hero-button rounded-2xl bg-teal-500 px-5 py-3 text-white font-semibold transition-all hover:bg-teal-400 active:scale-[0.98]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 py-16 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className={`text-center max-w-xl rounded-3xl border p-10 shadow-2xl ${isDark ? 'border-slate-800 bg-slate-900/95 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
          <h1 className="text-3xl font-bold mb-4">Access denied</h1>
          <p className={`${bodyText} mb-6">Only administrators can use this dashboard.</p>
          <button
            onClick={() => navigate('events')}
            className="hero-button rounded-2xl bg-teal-500 px-5 py-3 text-white font-semibold transition-all hover:bg-teal-400 active:scale-[0.98]"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 pb-16 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-10">
          <div>
            <p className="text-teal-300 uppercase tracking-[0.4em] text-xs">Admin Control Panel</p>
            <h1 className="mt-3 text-4xl font-bold">Manage Campus Events</h1>
            <p className={`mt-3 ${bodyText} max-w-2xl`}>
              Create event schedules, update categories, and publish events for students. New events appear immediately in the student dashboard.
            </p>
          </div>
          <div className={`rounded-3xl border px-6 py-5 shadow-xl ${isDark ? 'border-slate-800 bg-slate-900/90 text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
            <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total events published</div>
            <div className="mt-2 text-3xl font-semibold">{events.length}</div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.9fr_1fr]">
          <div className="space-y-10">
            <section className={`rounded-3xl p-8 shadow-xl ${isDark ? 'bg-slate-900/90 border border-slate-800' : 'bg-white border border-slate-200'}`}>
              <div className="flex items-center gap-3 text-teal-400 mb-6">
                <PlusCircle className="w-5 h-5" />
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Create a new event</h2>
              </div>
              {message && <div className="mb-6 rounded-2xl border border-teal-500/20 bg-teal-500/10 px-4 py-3 text-sm text-teal-100">{message}</div>}
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={`block text-sm ${labelText}`}>
                    Title
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Hackathon 2026"
                      className={`mt-2 w-full rounded-2xl border px-4 py-3 text-sm focus:border-teal-500 focus:outline-none ${isDark ? 'border-slate-700 bg-slate-950/90 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'}`}
                      required
                    />
                  </label>

                  <label className={`block text-sm ${labelText}`}>
                    Date
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={`block text-sm ${labelText}`}>
                    Venue
                    <input
                      value={form.venue}
                      onChange={(e) => setForm({ ...form, venue: e.target.value })}
                      placeholder="Main Auditorium"
                      className={inputClass}
                      required
                    />
                  </label>

                  <label className={`block text-sm ${labelText}`}>
                    Time
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={`block text-sm ${labelText}`}>
                    Category
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className={inputClass}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={`block text-sm ${labelText}`}>
                    Organizer
                    <input
                      value={form.organizer}
                      onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                      placeholder="Student Council"
                      className={inputClass}
                    />
                  </label>
                </div>

                <label className={`block text-sm ${labelText}`}>
                  Description
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Why students should attend this event"
                    rows={4}
                    className={inputClass}
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={`block text-sm ${labelText}`}>
                    Price (₹)
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className={inputClass}
                      required
                    />
                  </label>

                  <label className={`block text-sm ${labelText}`}>
                    Total seats
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={form.total_seats}
                      onChange={(e) => setForm({ ...form, total_seats: Number(e.target.value) })}
                      className={inputClass}
                      required
                    />
                  </label>
                </div>

                <label className={`block text-sm ${labelText}`}>
                  Image URL
                  <input
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="https://example.com/event.jpg"
                    className={inputClass}
                  />
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 flex-1 rounded-2xl bg-teal-500 px-5 py-3 text-white font-semibold hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? editingEventId
                        ? 'Updating event...'
                        : 'Publishing event...'
                      : editingEventId
                      ? 'Update event'
                      : 'Publish event'}
                  </button>
                  {editingEventId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="mt-2 flex-1 rounded-2xl border border-slate-700 bg-slate-800 px-5 py-3 text-slate-200 font-semibold hover:bg-slate-700"
                    >
                      Cancel edit
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className={`rounded-3xl p-8 shadow-xl ${cardPanel}`} >
              <div className="flex items-center gap-3 text-teal-400 mb-6">
                <TrendingUp className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Live enrollment tracker</h2>
              </div>
              <p className={`text-sm mb-6 ${bodyText}`}>
                Track tickets sold for your top events, updated every 8 seconds.
              </p>
              {events.length === 0 ? (
                <p className={bodyText}>No enrollment data available yet.</p>
              ) : (
                <div className="space-y-5">
                  {eventSales.slice(0, 5).map((eventItem) => (
                    <div key={eventItem.id}>
                      <div className={`flex items-center justify-between text-sm mb-2 ${bodyText}`}>
                        <span className={`font-semibold ${headerText} line-clamp-1`}>{eventItem.title}</span>
                        <span className={bodyText}>{eventItem.tickets_sold} tickets</span>
                      </div>
                      <div className={`h-3 rounded-full ${trackBg} overflow-hidden`}>
                        <div
                          className={`h-full rounded-full ${
                            eventItem.sold_pct >= 90
                              ? 'bg-emerald-400'
                              : eventItem.sold_pct >= 60
                              ? 'bg-teal-400'
                              : 'bg-sky-400'
                          }`}
                          style={{ width: `${eventItem.sold_pct}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                        <span>{eventItem.category}</span>
                        <span>{eventItem.sold_pct}% full</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-6 text-xs text-slate-500">
                Enrollment is calculated from seats sold and available seats for each event.
              </p>
            </section>

            <section className={`rounded-3xl p-8 shadow-xl ${cardPanel}`} >
              <div className="flex items-center gap-3 text-teal-400 mb-6">
                <Users className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Event booking summary</h2>
              </div>
              <p className={`text-sm mb-6 ${bodyText}`}>Total tickets sold for each event and remaining seat availability.</p>
              {events.length === 0 ? (
                <p className={bodyText}>No booking data available yet.</p>
              ) : (
                <div className="space-y-4">
                  <div className={`rounded-3xl p-5 ${cardPanel}`} >
                    <div className="text-sm text-slate-400 mb-2">Total tickets sold across events</div>
                    <div className={`text-3xl font-semibold ${headerText}`}>{totalTicketsSold}</div>
                  </div>
                  {eventSales.map((eventItem) => (
                    <div key={eventItem.id} className={`rounded-3xl p-5 ${cardPanel}`} >
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div>
                          <p className="text-sm text-slate-400">{eventItem.category}</p>
                          <h3 className={`font-semibold ${headerText}`}>{eventItem.title}</h3>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-semibold ${headerText}`}>{eventItem.tickets_sold}</div>
                          <div className="text-xs text-slate-500">tickets sold</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>{eventItem.available_seats} seats left</span>
                        <span>•</span>
                        <span>{eventItem.sold_pct}% full</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <section className={`rounded-3xl p-8 shadow-xl ${cardPanel}`} >
            <div className="flex items-center gap-3 text-teal-400 mb-6">
              <Bookmark className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Upcoming events</h2>
            </div>
            {loading ? (
              <p className={bodyText}>Loading events...</p>
            ) : (
              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className={bodyText}>No events published yet.</p>
                ) : (
                  events.map((eventItem) => (
                    <div key={eventItem.id} className={`rounded-3xl p-4 ${cardPanel}`} >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-teal-300 uppercase tracking-[0.2em] mb-1">{eventItem.category}</p>
                          <h3 className={`font-semibold ${headerText}`}>{eventItem.title}</h3>
                          <p className={`text-sm mt-2 line-clamp-2 ${bodyText}`}>{eventItem.description}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleEdit(eventItem)}
                            className="rounded-full bg-teal-500/10 text-teal-200 px-3 py-2 text-xs font-semibold hover:bg-teal-500/20"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(eventItem.id)}
                            className="rounded-full bg-red-600/10 text-red-300 px-3 py-2 text-xs font-semibold hover:bg-red-600/20"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className={`mt-4 grid gap-2 sm:grid-cols-2 text-sm ${bodyText}`}>
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{eventItem.date}</span>
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{eventItem.time}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{eventItem.venue}</span>
                        <span className="flex items-center gap-2"><Users className="w-4 h-4" />{eventItem.available_seats} seats left</span>
                        <span className="flex items-center gap-2"><DollarSign className="w-4 h-4" />₹{eventItem.price.toFixed(0)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
