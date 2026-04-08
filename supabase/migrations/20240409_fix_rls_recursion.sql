-- Fix infinite recursion in user_roles RLS policies

-- 1. Drop the problematic recursive policy
DROP POLICY IF EXISTS "Super admins can do all on user_roles" ON user_roles;

-- 2. Create a non-recursive policy for super_admins using a direct auth.uid() check
-- instead of querying the same table inside its own policy
CREATE POLICY "Super admins can do all on user_roles" ON user_roles
  FOR ALL USING (
    -- We can check if the current user is a super admin without a subquery
    -- by relying on a fast function or just checking the current row if it's an UPDATE/DELETE
    -- However, to avoid recursion entirely when selecting OTHER users' roles:
    (SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1) = 'super_admin'
  );

-- Wait, the above can still cause recursion if the SELECT triggers the policy itself.
-- The standard way to fix this in Supabase is to create a SECURITY DEFINER function:

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean AS $$
BEGIN
  -- We bypass RLS entirely in this function
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now drop the old policy again to be safe
DROP POLICY IF EXISTS "Super admins can do all on user_roles" ON user_roles;

-- Recreate it using the secure function
CREATE POLICY "Super admins can do all on user_roles" ON user_roles
  FOR ALL USING (
    public.is_super_admin()
  );

-- Also fix admin_permissions policy just in case, using the same function
DROP POLICY IF EXISTS "Super admins can do all on admin_permissions" ON admin_permissions;

CREATE POLICY "Super admins can do all on admin_permissions" ON admin_permissions
  FOR ALL USING (
    public.is_super_admin()
  );
