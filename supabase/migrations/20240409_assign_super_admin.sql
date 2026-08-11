INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin' 
FROM auth.users 
WHERE email = 'jake.bedwell@kairostudio.co.uk'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';