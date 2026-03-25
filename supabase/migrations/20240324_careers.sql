-- Create careers table
CREATE TABLE IF NOT EXISTS careers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  department text NOT NULL,
  location text NOT NULL,
  type text NOT NULL, -- e.g., 'Full-time', 'Contract', 'Freelance'
  description text NOT NULL,
  requirements jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public profiles are viewable by everyone."
  ON careers FOR SELECT
  USING ( true );

-- Allow authenticated admins to do everything
CREATE POLICY "Admins can insert careers"
  ON careers FOR INSERT
  WITH CHECK ( auth.role() = 'authenticated' );

CREATE POLICY "Admins can update careers"
  ON careers FOR UPDATE
  USING ( auth.role() = 'authenticated' );

CREATE POLICY "Admins can delete careers"
  ON careers FOR DELETE
  USING ( auth.role() = 'authenticated' );

-- Insert dummy data so the page has content immediately
INSERT INTO careers (title, department, location, type, description, requirements, is_active)
VALUES 
  (
    'Senior Frontend Engineer', 
    'Engineering', 
    'Remote (UK)', 
    'Full-time', 
    'We are looking for an experienced Frontend Engineer to help build highly interactive, performant web applications using React and Next.js.', 
    '["5+ years of React experience", "Deep understanding of Next.js and SSR", "Strong eye for design and CSS/Tailwind", "Experience with Supabase or Firebase"]'::jsonb, 
    true
  ),
  (
    'UI/UX Designer', 
    'Design', 
    'London / Hybrid', 
    'Contract', 
    'Join our creative team to design beautiful, user-centric interfaces for our enterprise clients. You will own the design process from wireframes to high-fidelity prototypes.', 
    '["Strong portfolio demonstrating web app design", "Expert in Figma", "Experience with design systems", "Understanding of modern web constraints"]'::jsonb, 
    true
  )
ON CONFLICT DO NOTHING;
