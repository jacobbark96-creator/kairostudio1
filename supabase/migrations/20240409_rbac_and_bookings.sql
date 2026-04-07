-- 1. 3-TIER ROLE-BASED ACCESS CONTROL (RBAC)

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('super_admin', 'admin', 'client')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can do all on user_roles" ON user_roles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
  );

-- Create admin_permissions table
CREATE TABLE IF NOT EXISTS admin_permissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  allowed_tab text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, allowed_tab)
);

ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read own permissions" ON admin_permissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Super admins can do all on admin_permissions" ON admin_permissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin')
  );

-- 2. ADMIN BOOKING TAB UPDATES

-- Ensure bookings table has the necessary columns
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS rep_notes text;

-- 3. MODULAR CLIENT PORTAL DASHBOARD

-- Update client_projects table
ALTER TABLE client_projects ADD COLUMN IF NOT EXISTS live_link text;
ALTER TABLE client_projects ADD COLUMN IF NOT EXISTS latest_update text;

-- Make sure RLS allows admins and super_admins to manage client_projects
DROP POLICY IF EXISTS "Admins can manage all projects" ON client_projects;
CREATE POLICY "Admins can manage all projects" ON client_projects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('super_admin', 'admin'))
  );

-- Function to handle new user signup and default to 'client' role
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'client');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_role();
