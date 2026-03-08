import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: { display_name?: string }) => Promise<void>;
  purchasedPackIds: string[];
  purchasePack: (packId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasedPackIds, setPurchasedPackIds] = useState<string[]>([]);

  // Set up auth listener BEFORE getSession
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch profile and purchases when user changes
  useEffect(() => {
    if (!user) {
      setProfile(null);
      setPurchasedPackIds([]);
      return;
    }

    const fetchData = async () => {
      const [profileRes, purchasesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("user_pack_purchases").select("pack_id").eq("user_id", user.id),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (purchasesRes.data) setPurchasedPackIds(purchasesRes.data.map((p) => p.pack_id));
    };
    fetchData();
  }, [user]);

  const signUp = async (email: string, password: string, displayName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    return { error: error?.message ?? null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (data: { display_name?: string }) => {
    if (!user) return;
    await supabase.from("profiles").update(data).eq("user_id", user.id);
    setProfile((p) => (p ? { ...p, ...data } : p));
  };

  const purchasePack = async (packId: string) => {
    if (!user) return;
    const { error } = await supabase.from("user_pack_purchases").insert({
      user_id: user.id,
      pack_id: packId,
    });
    if (!error) {
      setPurchasedPackIds((prev) => [...prev, packId]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
        purchasedPackIds,
        purchasePack,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
