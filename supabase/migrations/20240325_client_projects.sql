-- Create client_projects table
CREATE TABLE IF NOT EXISTS client_projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  project_name text NOT NULL,
  project_url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE client_projects ENABLE ROW LEVEL SECURITY;

-- Users can read their own projects
CREATE POLICY "Users can view own projects"
  ON client_projects FOR SELECT
  USING ( auth.uid() = user_id );

-- Admins can do everything
CREATE POLICY "Admins can manage client projects"
  ON client_projects FOR ALL
  USING ( 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
