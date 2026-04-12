import { Calendar, MapPin, Users, Tag, Clock } from 'lucide-react';
import { Event } from '../types';

const categoryColors: Record<string, string> = {
  Technology: 'bg-blue-100 text-blue-700',
  Cultural: 'bg-pink-100 text-pink-700',
  Sports: 'bg-green-100 text-green-700',
  Business: 'bg-amber-100 text-amber-700',
  Arts: 'bg-rose-100 text-rose-700',
  Science: 'bg-cyan-100 text-cyan-700',
  General: 'bg-gray-100 text-gray-700',
};

interface Props {
  event: Event;
  onBook: (event: Event) => void;
}

export default function EventCard({ event, onBook }: Props) {
  const soldOut = event.available_seats === 0;
  const almostFull = event.available_seats > 0 && event.available_seats <= 20;
  const fillPercent = Math.round(((event.total_seats - event.available_seats) / event.total_seats) * 100);

  const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[event.category] ?? categoryColors.General}`}>
          {event.category}
        </span>
        {soldOut && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">
            Sold Out
          </span>
        )}
        {almostFull && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-orange-500 text-white rounded-full text-xs font-semibold">
            Almost Full
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg leading-snug mb-1 line-clamp-2">
          {event.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{event.description}</p>

        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-500 shrink-0" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-500 shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-500 shrink-0" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-teal-500 shrink-0" />
            <span>{event.organizer}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{event.available_seats} seats left</span>
            </div>
            <span>{fillPercent}% filled</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                fillPercent >= 90 ? 'bg-red-500' : fillPercent >= 70 ? 'bg-orange-400' : 'bg-teal-500'
              }`}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {event.price === 0 ? 'Free' : `₹${event.price.toFixed(0)}`}
            </span>
            {event.price > 0 && <span className="text-gray-400 text-sm ml-1">/ ticket</span>}
          </div>
          <button
            onClick={() => onBook(event)}
            disabled={soldOut}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
              soldOut
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-teal-500 hover:bg-teal-400 text-white shadow-sm hover:shadow-teal-500/30 hover:shadow-md'
            }`}
          >
            {soldOut ? 'Sold Out' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
