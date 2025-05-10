
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, Users, MessageSquare, Video, 
  Clipboard, Heart, FileText, Settings, ChevronLeft, ChevronRight,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DoctorSidebarProps {
  className?: string;
}

const DoctorSidebar = ({ className }: DoctorSidebarProps) => {
  const location = useLocation();
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      name: "Dashboard",
      path: "/doctor-dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      name: "Patients",
      path: "/doctor-patients",
      icon: <Users className="h-4 w-4" />
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: <CalendarDays className="h-4 w-4" />
    },
    {
      name: "Video Consultations",
      path: "/doctor-consultations",
      icon: <Video className="h-4 w-4" />
    },
    {
      name: "Messages",
      path: "/doctor-messages",
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      name: "Health Records",
      path: "/doctor-records",
      icon: <FileText className="h-4 w-4" />
    },
    {
      name: "Prescriptions",
      path: "/doctor-prescriptions",
      icon: <Heart className="h-4 w-4" />
    },
    {
      name: "Settings",
      path: "/doctor-settings",
      icon: <Settings className="h-4 w-4" />
    }
  ];

  return (
    <motion.div 
      className={cn(
        "rounded-lg p-4 space-y-4 relative bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 shadow-md transition-all duration-300", 
        isSidebarCollapsed ? "w-16" : "w-60",
        className
      )}
      animate={{ width: isSidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center mb-6">
        {!isSidebarCollapsed && (
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="font-semibold">Dr. Sarah Johnson</h2>
              <span className="text-xs text-muted-foreground">General Practitioner</span>
            </div>
          </div>
        )}
        {isSidebarCollapsed && (
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200" />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
        )}
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant={isActive(item.path) ? "default" : "ghost"}
            className={cn(
              "w-full transition-all", 
              isActive(item.path) ? "bg-primary text-primary-foreground" : "",
              isSidebarCollapsed ? "justify-center px-0" : "justify-start"
            )}
            asChild
          >
            <Link to={item.path}>
              {item.icon}
              {!isSidebarCollapsed && <span className="ml-2">{item.name}</span>}
            </Link>
          </Button>
        ))}
      </nav>

      {/* Toggle Button */}
      <Button 
        variant="outline" 
        size="icon"
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 bg-background border rounded-full shadow-md hover:bg-primary hover:text-primary-foreground"
        onClick={toggleSidebar}
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </motion.div>
  );
};

export default DoctorSidebar;
