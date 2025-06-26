
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/ui/loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  redirectTo = "/auth" 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate(redirectTo);
        return;
      }

      if (requiredRole && user.role !== requiredRole) {
        // Redirect based on user role
        if (user.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
        return;
      }
    }
  }, [user, loading, navigate, requiredRole, redirectTo]);

  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!user) {
    return <LoadingScreen message="Redirecting to login..." />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <LoadingScreen message="Redirecting..." />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
