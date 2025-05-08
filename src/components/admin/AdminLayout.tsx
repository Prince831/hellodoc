
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin users
  if (!loading && (!user || user.role !== "admin")) {
    navigate("/");
    return null;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
