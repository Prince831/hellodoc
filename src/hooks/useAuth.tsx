import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "../integrations/supabase/client";

interface User {
  id: string;
  email: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        // Fetch user role from a 'profiles' table or user metadata
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          setUser({ id: data.user.id, email: data.user.email, role: "patient" }); // default role
        } else {
          setUser({ id: data.user.id, email: data.user.email, role: profileData.role });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
