INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin' 
FROM auth.users 
WHERE LOWER(email) = LOWER('jake.bedwell@kairostudio.co.uk')
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

UPDATE public.profiles SET role = 'admin' WHERE LOWER(email) = LOWER('jake.bedwell@kairostudio.co.uk');
