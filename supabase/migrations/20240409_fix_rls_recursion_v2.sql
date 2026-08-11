CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
BEGIN
  -- We query the table directly as the superuser (since SECURITY DEFINER runs as the creator)
  -- This bypasses RLS entirely, preventing the infinite loop.
  SELECT (role = 'super_admin') INTO is_admin 
  FROM public.user_roles 
  WHERE user_id = auth.uid();
  
  RETURN COALESCE(is_admin, false);
END;
$$;
