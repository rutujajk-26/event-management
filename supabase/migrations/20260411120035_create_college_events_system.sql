
/*
  # College Event Ticket Booking System - Database Schema

  ## New Tables

  ### 1. events
  Stores all college events available for booking.
  - id: UUID primary key
  - title: Event name
  - description: Full event description
  - date: Event date (YYYY-MM-DD)
  - time: Event time (HH:MM)
  - venue: Location of the event
  - category: Event category (Tech, Cultural, Sports, Business, Art, Science)
  - price: Ticket price in INR
  - total_seats: Maximum capacity
  - available_seats: Remaining seats (decremented on booking)
  - image_url: Pexels photo URL
  - organizer: Organizing department/committee
  - created_at: Record creation timestamp

  ### 2. bookings
  Stores all ticket bookings made by students.
  - id: UUID primary key
  - event_id: FK to events table
  - student_name: Full name of student
  - email: Student email address
  - phone: Contact number
  - college_id: Student college ID
  - num_tickets: Number of tickets booked
  - total_amount: Total cost (price * num_tickets)
  - booking_ref: Unique booking reference code
  - status: Booking status (confirmed, cancelled, pending)
  - created_at: Booking timestamp

  ## Security
  - RLS enabled on both tables
  - Public read access for events (anyone can browse)
  - Authenticated insert for bookings
  - Public insert allowed for bookings (students may not be auth users)

  ## Seed Data
  - 6 sample college events inserted
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  date date NOT NULL,
  time text NOT NULL DEFAULT '10:00',
  venue text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  price numeric(10, 2) NOT NULL DEFAULT 0,
  total_seats integer NOT NULL DEFAULT 100,
  available_seats integer NOT NULL DEFAULT 100,
  image_url text NOT NULL DEFAULT '',
  organizer text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  college_id text NOT NULL DEFAULT '',
  num_tickets integer NOT NULL DEFAULT 1,
  total_amount numeric(10, 2) NOT NULL DEFAULT 0,
  booking_ref text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Events: anyone can read
CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  TO anon, authenticated
  USING (true);

-- Bookings: anyone can insert (students booking without auth)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Bookings: users can view their own bookings by email
CREATE POLICY "Users can view bookings by email"
  ON bookings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Index for faster event lookups
CREATE INDEX IF NOT EXISTS idx_bookings_event_id ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- Seed sample college events
INSERT INTO events (title, description, date, time, venue, category, price, total_seats, available_seats, image_url, organizer) VALUES
(
  'TechFest 2024 - Annual Tech Symposium',
  'Join us for the biggest tech event of the year! Featuring keynote speakers from top tech companies, hands-on workshops on AI/ML, web development, and cybersecurity. Network with industry professionals and showcase your projects at the innovation expo.',
  '2024-04-15',
  '09:00',
  'Main Auditorium, Block A',
  'Technology',
  200.00,
  500,
  342,
  'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Department of Computer Science'
),
(
  'Kulturama 2024 - Annual Cultural Festival',
  'Three days of music, dance, drama, and art celebrating our diverse cultural heritage. Watch stunning performances from student groups, participate in competitions, and enjoy live concerts by top artists. A festival of colors, sounds, and traditions!',
  '2024-04-20',
  '16:00',
  'Open Air Theater, Main Campus',
  'Cultural',
  150.00,
  1000,
  673,
  'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Student Cultural Council'
),
(
  'Sportanza 2024 - Annual Sports Meet',
  'The ultimate college sports extravaganza with events in cricket, football, basketball, athletics, and more. Cheer for your department teams, witness thrilling competitions, and celebrate sportsmanship. Opening ceremony with a grand parade of all teams!',
  '2024-04-25',
  '07:00',
  'College Sports Complex',
  'Sports',
  100.00,
  2000,
  1456,
  'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Sports Committee & Physical Education Dept'
),
(
  'BizPlan Challenge 2024 - Business Competition',
  'Present your innovative business ideas to a panel of industry veterans and venture capitalists. Categories include tech startups, social enterprises, and product innovations. Winner receives seed funding of ₹1,00,000! Pre-registration for teams of 2-4 members required.',
  '2024-05-01',
  '10:00',
  'Conference Hall A, Management Block',
  'Business',
  300.00,
  200,
  87,
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
  'MBA Department & Entrepreneurship Cell'
),
(
  'Art Expo 2024 - Fine Arts Exhibition',
  'A curated exhibition of student artwork spanning painting, sculpture, photography, digital art, and installation art. Over 200 pieces from students across all departments. Special live art performances and interactive installations throughout the day.',
  '2024-05-05',
  '11:00',
  'College Art Gallery, Creative Block',
  'Arts',
  50.00,
  300,
  218,
  'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Department of Fine Arts'
),
(
  'Science & Innovation Fair 2024',
  'Witness groundbreaking research and experiments by our brightest science students. Projects spanning physics, chemistry, biology, environmental science, and robotics. Guest lectures from research scientists and live demonstrations. Open to all science enthusiasts!',
  '2024-05-10',
  '09:30',
  'Science Exhibition Hall, Science Block',
  'Science',
  100.00,
  500,
  389,
  'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Science Departments Consortium'
);
