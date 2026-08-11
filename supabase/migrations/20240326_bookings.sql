-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name text NOT NULL,
  client_email text NOT NULL,
  booking_date date NOT NULL,
  time_slot text NOT NULL, -- e.g., '09:00', '14:30'
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(booking_date, time_slot) -- Prevent double booking at database level
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a booking (public route)
CREATE POLICY "Anyone can create a booking"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Anyone can view bookings (to check availability, but we'll restrict what they see in the app)
CREATE POLICY "Anyone can view bookings"
  ON bookings FOR SELECT
  USING (true);

-- Only admins can update/delete bookings
CREATE POLICY "Admins can update bookings"
  ON bookings FOR UPDATE
  USING ( 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete bookings"
  ON bookings FOR DELETE
  USING ( 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );