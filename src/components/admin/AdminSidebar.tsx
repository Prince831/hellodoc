
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
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminSidebar = () => {
  const location = useLocation();
  const { toast } = useToast();

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Doctors Management",
      href: "/admin/doctors",
      icon: Activity,
    },
    {
      name: "Patient Management",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Appointments",
      href: "/admin/appointments",
      icon: Calendar,
    },
    {
      name: "Health Records",
      href: "/admin/health-records",
      icon: Clipboard,
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: MessageSquare,
    },
    {
      name: "Notifications",
      href: "/admin/notifications",
      icon: Bell,
    },
    {
      name: "System Security",
      href: "/admin/security",
      icon: Shield,
    },
    {
      name: "Settings",
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
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-14 items-center border-b border-slate-200 px-4 dark:border-slate-800">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200">
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
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <Button
          variant="outline"
          className="w-full justify-start"
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
