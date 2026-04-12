import { useEffect, useState, FormEvent } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Tag, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { loadRazorpayScript } from '../lib/razorpay';
import { BookingFormData } from '../types';

function generateRef(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return 'CTX-' + Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

const categoryColors: Record<string, string> = {
  Technology: 'bg-blue-100 text-blue-700',
  Cultural: 'bg-pink-100 text-pink-700',
  Sports: 'bg-green-100 text-green-700',
  Business: 'bg-amber-100 text-amber-700',
  Arts: 'bg-rose-100 text-rose-700',
  Science: 'bg-cyan-100 text-cyan-700',
  General: 'bg-gray-100 text-gray-700',
  Research: 'bg-cyan-100 text-cyan-700',
  Entertainment: 'bg-fuchsia-100 text-fuchsia-700',
  'Case Studies': 'bg-violet-100 text-violet-700',
  Traditional: 'bg-amber-100 text-amber-700',
};

interface Errors {
  student_name?: string;
  email?: string;
  phone?: string;
  college_id?: string;
  num_tickets?: string;
}

export default function BookingPage() {
  const { navigate, selectedEvent, setBookingDetails, user } = useApp();
  const event = selectedEvent;

  const [form, setForm] = useState<BookingFormData>({
    student_name: '',
    email: '',
    phone: '',
    college_id: '',
    num_tickets: 1,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        student_name: user.full_name || prev.student_name,
        email: user.email ?? prev.email,
        college_id: user.college_id || prev.college_id,
      }));
    }
  }, [user]);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No event selected.</p>
          <button onClick={() => navigate('events')} className="text-teal-600 font-semibold hover:underline">
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg rounded-3xl bg-white p-10 shadow-xl border border-slate-200 text-center">
          <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-teal-500" />
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Student login required</h1>
          <p className="text-slate-500 mb-6">Please sign in before booking. This keeps ticket records and payments secure.</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate('login')}
              className="rounded-2xl bg-teal-500 px-5 py-3 text-white font-semibold hover:bg-teal-400"
            >
              Login
            </button>
            <button
              onClick={() => navigate('signup')}
              className="rounded-2xl border border-slate-300 px-5 py-3 text-slate-700 font-semibold hover:bg-slate-100"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = event.price * form.num_tickets;
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

  const validate = (): boolean => {
    const errs: Errors = {};
    if (!form.student_name.trim() || form.student_name.trim().length < 2)
      errs.student_name = 'Please enter your full name (at least 2 characters)';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Please enter a valid email address';
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, '')))
      errs.phone = 'Please enter a valid 10-digit mobile number';
    if (!form.college_id.trim()) errs.college_id = 'Please enter your college/student ID';
    if (form.num_tickets < 1) errs.num_tickets = 'Minimum 1 ticket required';
    if (form.num_tickets > 5) errs.num_tickets = 'Maximum 5 tickets per booking';
    if (form.num_tickets > event.available_seats)
      errs.num_tickets = `Only ${event.available_seats} seats available`;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const saveBooking = async (status: string) => {
    const booking_ref = generateRef();
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        event_id: event.id,
        student_name: form.student_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        college_id: form.college_id.trim(),
        num_tickets: form.num_tickets,
        total_amount: totalAmount,
        booking_ref,
        status,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('events')
      .update({ available_seats: event.available_seats - form.num_tickets })
      .eq('id', event.id);

    setBookingDetails(data);
    navigate('confirmation');
  };

  const handlePayment = async () => {
    if (!razorpayKey) {
      await saveBooking('offline');
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded || !(window as any).Razorpay) {
      throw new Error('Unable to load Razorpay checkout.');
    }

    return new Promise<void>((resolve, reject) => {
      const options = {
        key: razorpayKey,
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'CampusTix',
        description: event.title,
        image: 'https://static-assets.supabase.com/logo.svg',
        prefill: {
          name: form.student_name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          event_id: event.id,
        },
        handler: async () => {
          try {
            await saveBooking('paid');
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        theme: {
          color: '#14b8a6',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on('payment.failed', () => reject(new Error('Payment failed. Please try again.')));
      razorpay.open();
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (totalAmount > 0 && razorpayKey) {
        await handlePayment();
      } else {
        await saveBooking(totalAmount > 0 ? 'offline' : 'confirmed');
      }
    } catch (error) {
      setApiError((error as Error).message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => navigate('events')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="relative h-52">
                <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[event.category] ?? categoryColors.General}`}>
                  {event.category}
                </span>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 leading-snug">{event.title}</h2>

                <div className="space-y-3 text-sm text-gray-600 mb-5">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>{event.available_seats} seats remaining</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Tag className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>{event.organizer}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Price per ticket</span>
                    <span className="font-semibold text-gray-900">
                      {event.price === 0 ? 'Free' : `₹${event.price.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">No. of tickets</span>
                    <span className="font-semibold text-gray-900">×{form.num_tickets}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span className="font-bold text-gray-900">Total Amount</span>
                    <span className="font-bold text-teal-600 text-lg">
                      {event.price === 0 ? 'Free' : `₹${totalAmount.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
              <p className="text-gray-500 mb-8">Fill in your details to secure your tickets</p>

              {apiError && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6 text-red-700">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-sm">{apiError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={form.student_name}
                    onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow ${errors.student_name ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                  {errors.student_name && <p className="mt-1.5 text-xs text-red-600">{errors.student_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. priya@college.edu"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                    />
                    {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      College / Student ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CS21B1034"
                      value={form.college_id}
                      onChange={(e) => setForm({ ...form, college_id: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow ${errors.college_id ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                    />
                    {errors.college_id && <p className="mt-1.5 text-xs text-red-600">{errors.college_id}</p>}
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Number of Tickets <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, num_tickets: Math.max(1, form.num_tickets - 1) })}
                        className="w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 text-xl transition-colors flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="text-2xl font-bold text-gray-900 w-10 text-center">{form.num_tickets}</span>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, num_tickets: Math.min(Math.min(5, event.available_seats), form.num_tickets + 1) })}
                        className="w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 text-xl transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                      <span className="text-sm text-gray-400">max 5 per booking</span>
                    </div>
                    {errors.num_tickets && <p className="mt-1.5 text-xs text-red-600">{errors.num_tickets}</p>}
                  </div>

                  <div className="flex flex-col justify-between">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Booking status</label>
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                      {event.price === 0 ? 'Free event' : `Total ₹${totalAmount.toFixed(2)} payable`}
                    </div>
                  </div>
                </div>

                {form.num_tickets > event.available_seats && (
                  <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                    Only {event.available_seats} seats currently available. Reduce ticket quantity to continue.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full flex items-center justify-center gap-3 py-4 bg-teal-500 hover:bg-teal-400 disabled:bg-teal-300 text-white rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:shadow-teal-500/25 active:scale-[0.98]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Confirm Booking${event.price > 0 ? ` — ₹${totalAmount.toFixed(0)}` : ' — Free'}`
                  )}
                </button>
                {event.price > 0 && !razorpayKey && (
                  <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                    Razorpay key is not configured. Booking will proceed as offline/demo payment.
                  </div>
                )}
                <p className="text-center text-xs text-gray-400 mt-3">
                  By booking, you agree to our Terms of Service and Refund Policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
