export type Role = 'admin' | 'student' | 'guest';

export interface User {
  id: string;
  email: string | null;
  full_name: string;
  role: Role;
  college_id: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  price: number;
  total_seats: number;
  available_seats: number;
  image_url: string;
  organizer: string;
  created_at: string;
}

export interface Booking {
  id: string;
  event_id: string;
  student_name: string;
  email: string;
  phone: string;
  college_id: string;
  num_tickets: number;
  total_amount: number;
  booking_ref: string;
  status: string;
  created_at: string;
}

export interface BookingFormData {
  student_name: string;
  email: string;
  phone: string;
  college_id: string;
  num_tickets: number;
}

export type Page = 'home' | 'events' | 'booking' | 'confirmation' | 'login' | 'signup' | 'admin';

export type Category =
  | 'All'
  | 'Technology'
  | 'Case Studies'
  | 'Research'
  | 'Entertainment'
  | 'Cultural'
  | 'Traditional'
  | 'Business'
  | 'Arts'
  | 'Science'
  | 'General';
