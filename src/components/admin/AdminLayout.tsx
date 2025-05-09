
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
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-50">
      <div className="bg-slate-950 border-b border-slate-800 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">HealthCare System Administration</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm bg-purple-900/50 px-3 py-1 rounded-full border border-purple-700">
                Admin Control Panel
              </span>
            </div>
          </div>
        </div>
      </div>
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
