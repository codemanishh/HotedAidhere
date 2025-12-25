import { useState, useEffect, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);

  const checkAdminRole = useCallback(async (userId: string) => {
    try {
      console.log("Checking admin role for user:", userId);
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      console.log("Admin role check result:", { data, error });

      if (!error && data) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Error checking admin role:", err);
      setIsAdmin(false);
    } finally {
      setAdminCheckComplete(true);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Reset admin state when logged out
        if (!session?.user) {
          setIsAdmin(false);
          setAdminCheckComplete(true);
          return;
        }
        
        // Check admin role after a brief delay to ensure session is established
        setAdminCheckComplete(false);
        setTimeout(() => {
          checkAdminRole(session.user.id);
        }, 100);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await checkAdminRole(session.user.id);
      } else {
        setAdminCheckComplete(true);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [checkAdminRole]);

  const signIn = async (email: string, password: string) => {
    setAdminCheckComplete(false);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setIsAdmin(false);
      setAdminCheckComplete(true);
    }
    return { error };
  };

  return {
    user,
    session,
    loading: loading || !adminCheckComplete,
    isAdmin,
    signIn,
    signUp,
    signOut,
  };
};
