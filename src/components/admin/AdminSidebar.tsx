
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
  Shield,
  Bell,
  FileText,
  BriefcaseMedical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const AdminSidebar = () => {
  const location = useLocation();
  const { toast } = useToast();

  const navItems = [
    {
      name: "Dashboard Overview",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      description: "System performance and statistics"
    },
    {
      name: "Doctor Management",
      href: "/admin/doctors",
      icon: BriefcaseMedical,
      description: "Add or manage healthcare providers"
    },
    {
      name: "Patient Management",
      href: "/admin/users",
      icon: Users,
      description: "User accounts and profiles"
    },
    {
      name: "Appointments",
      href: "/admin/appointments",
      icon: Calendar,
      description: "Schedule and appointment data"
    },
    {
      name: "Medical Records",
      href: "/admin/health-records",
      icon: Clipboard,
      description: "Patient health documentation"
    },
    {
      name: "Communication",
      href: "/admin/messages",
      icon: MessageSquare,
      description: "Patient-doctor communications",
      badge: 12
    },
    {
      name: "Notifications",
      href: "/admin/notifications",
      icon: Bell,
      description: "System alerts and updates",
      badge: 2
    },
    {
      name: "Security",
      href: "/admin/security",
      icon: Shield,
      description: "Access controls and permissions"
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: FileText,
      description: "Reporting and statistics"
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      description: "System configuration"
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
    <aside className="flex h-screen w-72 flex-col bg-white dark:bg-slate-800 border-r dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-3 border-b dark:border-slate-700 px-6 py-4">
        <Avatar className="h-9 w-9 bg-primary">
          <AvatarFallback className="text-primary-foreground font-semibold">HC</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-foreground text-base">
            Healthcare Admin
          </h2>
          <p className="text-xs text-muted-foreground">System Control Center</p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <nav className="grid gap-1 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-muted",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <span className={cn(
                        "ml-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold flex-shrink-0",
                        isActive ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground mt-1 truncate">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t dark:border-slate-700 p-4">
        <div className="mb-3 px-3">
          <p className="text-xs text-muted-foreground">Logged in as <span className="font-medium text-foreground">Admin User</span></p>
        </div>
        <Button
          variant="outline"
          size="sm"
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
