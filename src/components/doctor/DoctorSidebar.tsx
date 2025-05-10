
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Settings,
  Video,
  Clipboard,
  LogOut
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DoctorSidebarProps {
  className?: string;
}

const DoctorSidebar = ({ className }: DoctorSidebarProps) => {
  const location = useLocation();
  const { toast } = useToast();

  const navigationItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/doctor-dashboard",
      description: "Overview of your activities"
    },
    {
      title: "Appointments",
      icon: Calendar,
      href: "/doctor/appointments",
      description: "Manage your schedule",
      badge: 8
    },
    {
      title: "Patients",
      icon: Users,
      href: "/doctor/patients",
      description: "Your patient directory"
    },
    {
      title: "Consultations",
      icon: Video,
      href: "/video-consultation",
      description: "Virtual appointments"
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: "/doctor/messages",
      description: "Patient communications",
      badge: 7
    },
    {
      title: "Health Records",
      icon: Clipboard,
      href: "/doctor/health-records",
      description: "View patient documents"
    },
    {
      title: "Prescriptions",
      icon: FileText,
      href: "/doctor/prescriptions",
      description: "Medical prescriptions"
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/doctor/settings",
      description: "Account preferences"
    },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of your account"
    });
  };

  return (
    <div className={cn("w-64 flex flex-col h-[calc(100vh-4rem)] border-r bg-white dark:bg-slate-800 dark:border-slate-700", className)}>
      <div className="p-4 border-b dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200" />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">Dr. Sarah Johnson</p>
            <p className="text-xs text-muted-foreground">General Practitioner</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-md bg-green-100 dark:bg-green-900/20 p-2 text-center">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="text-sm font-medium text-green-600 dark:text-green-400">Available</p>
          </div>
          <div className="rounded-md bg-blue-100 dark:bg-blue-900/20 p-2 text-center">
            <p className="text-xs text-muted-foreground">Rating</p>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">4.8 ★</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link 
                key={item.href} 
                to={item.href}
                className={cn(
                  "flex items-center group relative space-x-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-muted",
                  isActive ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className={cn(
                        "rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium",
                        isActive ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                {isActive && (
                  <span className="absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-l-full bg-foreground" />
                )}
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t dark:border-slate-700">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default DoctorSidebar;
