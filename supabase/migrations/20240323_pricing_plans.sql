-- Create pricing_plans table
CREATE TABLE IF NOT EXISTS pricing_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  price text NOT NULL,
  billing_period text DEFAULT 'per month',
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_popular boolean DEFAULT false,
  button_text text DEFAULT 'Get Started',
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public profiles are viewable by everyone."
  ON pricing_plans FOR SELECT
  USING ( true );

-- Allow authenticated admins to do everything
CREATE POLICY "Admins can insert pricing plans"
  ON pricing_plans FOR INSERT
  WITH CHECK ( auth.role() = 'authenticated' );

CREATE POLICY "Admins can update pricing plans"
  ON pricing_plans FOR UPDATE
  USING ( auth.role() = 'authenticated' );

CREATE POLICY "Admins can delete pricing plans"
  ON pricing_plans FOR DELETE
  USING ( auth.role() = 'authenticated' );

-- Insert default dummy data so the site has something to show immediately
INSERT INTO pricing_plans (name, description, price, billing_period, features, is_popular, sort_order)
VALUES 
  ('Starter', 'Perfect for small businesses just getting online.', '£99', 'per month', '["Custom Design", "Mobile Responsive", "Basic SEO", "Fast Hosting"]'::jsonb, false, 1),
  ('Professional', 'Our most popular plan for growing companies.', '£249', 'per month', '["Everything in Starter", "CMS Integration", "Advanced SEO", "Analytics Dashboard", "Priority Support"]'::jsonb, true, 2),
  ('Enterprise', 'Full-scale digital transformation.', 'Custom', '', '["Everything in Pro", "Custom Web App", "E-Commerce", "Dedicated Account Manager", "Unlimited Revisions"]'::jsonb, false, 3)
ON CONFLICT DO NOTHING;
