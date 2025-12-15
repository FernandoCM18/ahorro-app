import type { Session, User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import supabase from "../lib/supabase";

type UseAuthReturn = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string) => Promise<{ error: Error | null }>;
  signUp: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    return { error: error as Error | null };
  }, []);

  const signUp = useCallback(
    (email: string) => {
      // For magic link auth, signIn and signUp are the same
      return signIn(email);
    },
    [signIn]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }, []);

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
