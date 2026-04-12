import { CheckCircle, Download, Calendar, MapPin, Clock, Ticket, ArrowRight, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ConfirmationPage() {
  const { navigate, bookingDetails, selectedEvent } = useApp();

  if (!bookingDetails || !selectedEvent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No booking found.</p>
          <button onClick={() => navigate('events')} className="text-teal-600 font-semibold hover:underline">
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(selectedEvent.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const bookingDate = new Date(bookingDetails.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="relative inline-flex mb-6">
            <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center shadow-xl shadow-teal-500/30">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500">Your tickets have been booked successfully. Check your email for details.</p>
        </div>

        {/* Booking Reference Card */}
        <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl p-6 text-white mb-6 shadow-xl shadow-teal-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-teal-100" />
              <span className="font-semibold text-teal-100">Booking Reference</span>
            </div>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wider">
              {bookingDetails.status}
            </span>
          </div>
          <div className="text-4xl font-mono font-bold tracking-widest mb-4">{bookingDetails.booking_ref}</div>
          <div className="text-teal-100 text-sm">Issued on {bookingDate}</div>
        </div>

        {/* Ticket Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="relative h-40 overflow-hidden">
            <img src={selectedEvent.image_url} alt={selectedEvent.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h2 className="absolute bottom-4 left-5 right-5 text-white font-bold text-lg leading-snug">
              {selectedEvent.title}
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Date</p>
                  <p className="text-sm font-semibold text-gray-800">{formattedDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Time</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedEvent.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Venue</p>
                  <p className="text-sm font-semibold text-gray-800">{selectedEvent.venue}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 pt-5">
              <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Attendee Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 mb-0.5">Name</p>
                  <p className="font-semibold text-gray-800">{bookingDetails.student_name}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Student ID</p>
                  <p className="font-semibold text-gray-800">{bookingDetails.college_id}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Email</p>
                  <p className="font-semibold text-gray-800 break-all">{bookingDetails.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Phone</p>
                  <p className="font-semibold text-gray-800">{bookingDetails.phone}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Tickets</p>
                  <p className="font-semibold text-gray-800">{bookingDetails.num_tickets} ticket{bookingDetails.num_tickets > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Total Paid</p>
                  <p className="font-bold text-teal-600">
                    {bookingDetails.total_amount === 0 ? 'Free' : `₹${bookingDetails.total_amount.toFixed(2)}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <p className="font-semibold mb-1">Important — Bring this to the event:</p>
          <ul className="list-disc list-inside space-y-1 text-amber-700">
            <li>Your booking reference: <strong>{bookingDetails.booking_ref}</strong></li>
            <li>Your college ID card</li>
            <li>This confirmation on your phone or printed</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Ticket
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'My Ticket', text: `Booking ref: ${bookingDetails.booking_ref}` });
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={() => navigate('events')}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-teal-500 hover:bg-teal-400 text-white rounded-xl font-semibold transition-colors"
          >
            More Events
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
