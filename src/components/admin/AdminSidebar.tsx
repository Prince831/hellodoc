
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Users,
  LayoutDashboard,
  Calendar,
  Clipboard,
  MessageSquare,
  Settings,
  LogOut,
  Activity,
  Shield,
  Bell,
  Database,
  BriefcaseMedical,
  UserCog,
  FileAnalytics
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminSidebar = () => {
  const location = useLocation();
  const { toast } = useToast();

  const navItems = [
    {
      name: "System Overview",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Doctor Management",
      href: "/admin/doctors",
      icon: BriefcaseMedical,
    },
    {
      name: "Patient Management",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Appointment Control",
      href: "/admin/appointments",
      icon: Calendar,
    },
    {
      name: "Health Records",
      href: "/admin/health-records",
      icon: Clipboard,
    },
    {
      name: "Communication Center",
      href: "/admin/messages",
      icon: MessageSquare,
    },
    {
      name: "System Alerts",
      href: "/admin/notifications",
      icon: Bell,
    },
    {
      name: "Security Management",
      href: "/admin/security",
      icon: Shield,
    },
    {
      name: "Analytics & Reports",
      href: "/admin/analytics",
      icon: FileAnalytics,
    },
    {
      name: "System Configuration",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-800 bg-slate-950">
      <div className="flex h-14 items-center border-b border-slate-800 px-4">
        <h2 className="font-semibold text-purple-400">
          ADMIN CONTROL PANEL
        </h2>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-purple-900/50 text-purple-200"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-800 p-4">
        <Button
          variant="outline"
          className="w-full justify-start border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
