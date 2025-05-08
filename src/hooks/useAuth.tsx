
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
        // Set default role since we don't have a profiles table yet
        // In a real application, you would fetch this from a profiles table
        setUser({ 
          id: data.user.id, 
          email: data.user.email, 
          // This is a temporary solution until the profiles table is created
          role: "patient" // Default role
        });
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
