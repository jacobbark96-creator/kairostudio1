-- Create franchise locations table
CREATE TABLE IF NOT EXISTS franchise_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  city_name text NOT NULL,
  x_coordinate numeric NOT NULL,
  y_coordinate numeric NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'available' CHECK (status IN ('available', 'pending', 'filled'))
);

-- Create franchise applications table
CREATE TABLE IF NOT EXISTS franchise_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  location_interest text,
  message text
);

-- RLS for franchise_locations
ALTER TABLE franchise_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view franchise locations" ON franchise_locations FOR SELECT USING (true);
CREATE POLICY "Admins can manage franchise locations" ON franchise_locations FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin', 'super_admin'))
);

-- RLS for franchise_applications
ALTER TABLE franchise_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert franchise applications" ON franchise_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view franchise applications" ON franchise_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admins can manage franchise applications" ON franchise_applications FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin', 'super_admin'))
);
