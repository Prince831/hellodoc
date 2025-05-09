
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect non-admin users
    if (!loading && (!user || user.role !== "admin")) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this area.",
        variant: "destructive"
      });
      navigate("/");
    }
  }, [loading, user, navigate, toast]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render anything if the user doesn't have admin rights
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <Navbar className="border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950" />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
