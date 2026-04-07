SELECT * FROM user_roles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'jake.bedwell@kairostudio.co.uk');
