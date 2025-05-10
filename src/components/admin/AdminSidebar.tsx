
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
  FileText,
  BriefcaseMedical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
      icon: FileText,
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
    <aside className="flex h-full w-64 flex-col bg-gradient-to-b from-indigo-950 to-purple-900 text-white">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8 bg-white/10 text-white">
            <AvatarFallback>HC</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-white">
              Healthcare Admin
            </h2>
            <p className="text-xs text-indigo-300">System Control Panel</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-6 px-4">
        <nav className="grid gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-indigo-200 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
              {item.name === "System Alerts" && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  2
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
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
