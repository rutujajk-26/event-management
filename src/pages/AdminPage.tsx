import { useEffect, useState, FormEvent } from 'react';
import { PlusCircle, Calendar, Clock, MapPin, DollarSign, Users, Bookmark } from 'lucide-react';
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
  const { user, navigate } = useApp();
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [originalEvent, setOriginalEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') return;

    loadEvents();
  }, [user]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (error) {
      setMessage(`Unable to load events: ${(error as Error).message}`);
    }
    setLoading(false);
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
      setEvents((current) => [...current, createdEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
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
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-xl rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-2xl">
          <h1 className="text-3xl font-bold mb-4">Admin access required</h1>
          <p className="text-slate-400 mb-6">Please sign in with your admin credentials to manage events.</p>
          <button
            onClick={() => navigate('login')}
            className="rounded-2xl bg-teal-500 px-5 py-3 text-white font-semibold hover:bg-teal-400"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-xl rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-2xl">
          <h1 className="text-3xl font-bold mb-4">Access denied</h1>
          <p className="text-slate-400 mb-6">Only administrators can use this dashboard.</p>
          <button
            onClick={() => navigate('events')}
            className="rounded-2xl bg-teal-500 px-5 py-3 text-white font-semibold hover:bg-teal-400"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-10">
          <div>
            <p className="text-teal-300 uppercase tracking-[0.4em] text-xs">Admin Control Panel</p>
            <h1 className="mt-3 text-4xl font-bold">Manage Campus Events</h1>
            <p className="mt-3 text-slate-400 max-w-2xl">
              Create event schedules, update categories, and publish events for students. New events appear immediately in the student dashboard.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 px-6 py-5 shadow-xl">
            <div className="text-sm text-slate-400">Total events published</div>
            <div className="mt-2 text-3xl font-semibold text-white">{events.length}</div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-xl">
            <div className="flex items-center gap-3 text-teal-400 mb-6">
              <PlusCircle className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Create a new event</h2>
            </div>
            {message && <div className="mb-6 rounded-2xl border border-teal-500/20 bg-teal-500/10 px-4 py-3 text-sm text-teal-100">{message}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  Title
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Hackathon 2026"
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none"
                    required
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  Date
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  Venue
                  <input
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    placeholder="Main Auditorium"
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none"
                    required
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  Time
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  Category
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm text-slate-300">
                  Organizer
                  <input
                    value={form.organizer}
                    onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                    placeholder="Student Council"
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none"
                  />
                </label>
              </div>

              <label className="block text-sm text-slate-300">
                Description
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Why students should attend this event"
                  rows={4}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  Price (₹)
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none"
                    required
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  Total seats
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={form.total_seats}
                    onChange={(e) => setForm({ ...form, total_seats: Number(e.target.value) })}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none"
                    required
                  />
                </label>
              </div>

              <label className="block text-sm text-slate-300">
                Image URL
                <input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://example.com/event.jpg"
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none"
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

          <section className="rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-xl">
            <div className="flex items-center gap-3 text-teal-400 mb-6">
              <Bookmark className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Upcoming events</h2>
            </div>
            {loading ? (
              <p className="text-slate-400">Loading events...</p>
            ) : (
              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-slate-400">No events published yet.</p>
                ) : (
                  events.map((eventItem) => (
                    <div key={eventItem.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm text-teal-300 uppercase tracking-[0.2em] mb-1">{eventItem.category}</p>
                          <h3 className="font-semibold text-white">{eventItem.title}</h3>
                          <p className="text-slate-400 text-sm mt-2 line-clamp-2">{eventItem.description}</p>
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
                      <div className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-slate-400">
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
