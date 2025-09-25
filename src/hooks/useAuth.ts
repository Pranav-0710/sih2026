import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: string | null;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateUser: (data: any) => Promise<any>;
  updateUserEmail: (email: string) => Promise<any>;
  reauthenticate: () => Promise<any>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  role: null,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  updateUser: async () => ({ error: null }),
  updateUserEmail: async () => ({ error: null }),
  reauthenticate: async () => ({ error: null }),
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const { toast } = useToast();

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: 'user', // Default role for new sign-ups
          }
        }
      });

      if (error) {
        toast({
          title: "Signup Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Success",
        description: "Please check your email to confirm your account",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // WARNING: Hardcoding admin emails in client-side code is not secure for production.
      // This is for demonstration purposes only. In a real application, roles should be
      // managed securely on the backend or directly in Supabase user metadata.
      const adminEmails = ['pranavkanth07@gmail.com', 'mukundangopalachary@gmail.com'];
      if (data.user && adminEmails.includes(data.user.email || '')) {
        setRole('admin');
      } else if (data.user) {
        setRole(data.user.user_metadata?.role || 'user');
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setRole(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateUser = async (data: any) => {
    const { error } = await supabase.auth.updateUser(data);
    return { error };
  };

  const updateUserEmail = async (email: string) => {
    const { error } = await supabase.auth.updateUser({ email });
    return { error };
  };

  const reauthenticate = async () => {
    const { error } = await supabase.auth.reauthenticate();
    return { error };
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (event === 'SIGNED_OUT') {
          setRole(null);
        } else if (session?.user) {
          const adminEmails = ['pranavkanth07@gmail.com', 'mukundangopalachary@gmail.com'];
          if (adminEmails.includes(session.user.email || '')) {
            setRole('admin');
          } else {
            setRole(session.user.user_metadata?.role || 'user');
          }
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const adminEmails = ['pranavkanth07@gmail.com', 'mukundangopalachary@gmail.com'];
        if (adminEmails.includes(session.user.email || '')) {
          setRole('admin');
        } else {
          setRole(session.user.user_metadata?.role || 'user');
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    loading,
    role,
    signUp,
    signIn,
    signOut,
    updateUser,
    updateUserEmail,
    reauthenticate,
  };
};