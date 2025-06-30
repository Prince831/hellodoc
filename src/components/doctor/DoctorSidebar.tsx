
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
import { useDoctorContext } from "@/contexts/DoctorContext";

interface DoctorSidebarProps {
  className?: string;
}

const DoctorSidebar = ({ className }: DoctorSidebarProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const { unreadMessagesCount, pendingAppointmentsCount, currentDoctor } = useDoctorContext();

  const navigationItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/doctor/dashboard",
      description: "Overview of your activities"
    },
    {
      title: "Appointments",
      icon: Calendar,
      href: "/doctor/appointments",
      description: "Manage your schedule",
      badge: pendingAppointmentsCount
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
      href: "/doctor/consultations",
      description: "Virtual appointments"
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: "/doctor/messages",
      description: "Patient communications",
      badge: unreadMessagesCount
    },
    {
      title: "Records",
      icon: FileText,
      href: "/doctor/records",
      description: "Patient medical records"
    },
    {
      title: "Prescriptions",
      icon: Clipboard,
      href: "/doctor/prescriptions",
      description: "Manage prescriptions"
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
    <div className={cn("flex flex-col h-full w-64 bg-white dark:bg-slate-800 border-r dark:border-slate-700", className)}>
      <div className="p-6 border-b dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentDoctor?.image_url || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200"} />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{currentDoctor?.name || "Dr. Sarah Johnson"}</p>
            <p className="text-xs text-muted-foreground">{currentDoctor?.specialization || "General Practitioner"}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3 text-center">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
              {currentDoctor?.availability ? "Available" : "Offline"}
            </p>
          </div>
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-center">
            <p className="text-xs text-muted-foreground">Rating</p>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {currentDoctor?.rating || "4.8"} ★
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="py-4 space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link 
                key={item.href} 
                to={item.href}
                className={cn(
                  "flex items-center group relative space-x-3 px-3 py-3 rounded-lg text-sm transition-all duration-200 hover:bg-muted",
                  isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{item.title}</span>
                    {item.badge && item.badge > 0 && (
                      <span className={cn(
                        "rounded-full h-5 w-5 flex items-center justify-center text-xs font-semibold flex-shrink-0 ml-2",
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
