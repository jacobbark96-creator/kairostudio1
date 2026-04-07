"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  userRole: 'super_admin' | 'admin' | 'client' | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  userRole: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<'super_admin' | 'admin' | 'client' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const [profileResponse, roleResponse] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        (supabase as any).from('user_roles').select('role').eq('user_id', userId).single()
      ]);
      
      if (profileResponse.error && profileResponse.error.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileResponse.error);
      }
      
      if (roleResponse.error && roleResponse.error.code !== 'PGRST116') {
        console.error('Error fetching user role:', roleResponse.error);
      }
      
      setProfile(profileResponse.data);
      if (roleResponse.data) {
        setUserRole(roleResponse.data.role as 'super_admin' | 'admin' | 'client');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUserRole(null);
  };

  // User is considered admin if they have the legacy admin role OR the new super_admin/admin role
  const isAdmin = profile?.role === 'admin' || userRole === 'super_admin' || userRole === 'admin';

  return (
    <AuthContext.Provider value={{ session, user, profile, userRole, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
