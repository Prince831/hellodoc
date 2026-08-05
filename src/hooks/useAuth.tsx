import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "patient" | "doctor" | "admin";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  isDoctor: boolean;
  isAdmin: boolean;
  doctorId: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  roles: [],
  isDoctor: false,
  isAdmin: false,
  doctorId: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Register the listener first so no auth event is missed.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (!nextSession?.user) {
        setRoles([]);
        setDoctorId(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    // Deferred so we never call Supabase from inside the auth callback.
    setTimeout(async () => {
      const [{ data: roleRows }, { data: doctorRow }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", user.id),
        supabase.from("doctors").select("id").eq("user_id", user.id).maybeSingle(),
      ]);
      if (cancelled) return;
      setRoles(((roleRows ?? []) as { role: AppRole }[]).map((r) => r.role));
      setDoctorId(doctorRow?.id ?? null);
    }, 0);

    return () => {
      cancelled = true;
    };
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setRoles([]);
    setDoctorId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        roles,
        isDoctor: roles.includes("doctor"),
        isAdmin: roles.includes("admin"),
        doctorId,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
