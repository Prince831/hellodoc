
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
  Activity
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
      name: "Patient Management",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Doctor Management",
      href: "/admin/doctors",
      icon: Activity,
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
    <aside className="flex h-full w-64 flex-col border-r bg-background">
      <div className="p-4">
        <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
          Admin Panel
        </h2>
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto p-4">
        <Button
          variant="ghost"
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
