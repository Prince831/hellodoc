
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, FileText, MessageSquare, Home, 
  Settings, UserCircle, Stethoscope, Users, Video,
  PillIcon, Monitor, BarChart3, Shield, Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SideNavProps {
  collapsed?: boolean;
}

const SideNav = ({ collapsed = false }: SideNavProps) => {
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;

  const getNavigationItems = () => {
    if (!user) {
      return [
        { path: "/", icon: Home, label: "Home" },
        { path: "/symptom-checker", icon: Stethoscope, label: "Symptom Checker" },
      ];
    }

    switch (user.role) {
      case 'doctor':
        return [
          { path: "/doctor/dashboard", icon: Home, label: "Dashboard" },
          { path: "/doctor/appointments", icon: CalendarDays, label: "Appointments" },
          { path: "/doctor/patients", icon: Users, label: "Patients" },
          { path: "/doctor/messages", icon: MessageSquare, label: "Messages" },
          { path: "/doctor/consultations", icon: Video, label: "Consultations" },
          { path: "/doctor/records", icon: FileText, label: "Records" },
          { path: "/doctor/prescriptions", icon: PillIcon, label: "Prescriptions" },
          { path: "/profile", icon: UserCircle, label: "Profile" },
          { path: "/doctor/settings", icon: Settings, label: "Settings" },
        ];
      case 'admin':
        return [
          { path: "/admin/dashboard", icon: Home, label: "Dashboard" },
          { path: "/admin/users", icon: Users, label: "Users" },
          { path: "/admin/doctors", icon: Stethoscope, label: "Doctors" },
          { path: "/admin/appointments", icon: CalendarDays, label: "Appointments" },
          { path: "/admin/health-records", icon: FileText, label: "Health Records" },
          { path: "/admin/messages", icon: MessageSquare, label: "Messages" },
          { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
          { path: "/admin/security", icon: Shield, label: "Security" },
          { path: "/admin/notifications", icon: Bell, label: "Notifications" },
          { path: "/profile", icon: UserCircle, label: "Profile" },
          { path: "/admin/settings", icon: Settings, label: "Settings" },
        ];
      default: // patient
        return [
          { path: "/", icon: Home, label: "Home" },
          { path: "/dashboard", icon: Monitor, label: "Dashboard" },
          { path: "/appointments", icon: CalendarDays, label: "Appointments" },
          { path: "/health-records", icon: FileText, label: "Health Records" },
          { path: "/medications", icon: PillIcon, label: "Medications" },
          { path: "/messages", icon: MessageSquare, label: "Messages" },
          { path: "/video-consultation", icon: Video, label: "Video Call" },
          { path: "/symptom-checker", icon: Stethoscope, label: "Symptom Checker" },
          { path: "/profile", icon: UserCircle, label: "Profile" },
          { path: "/settings", icon: Settings, label: "Settings" },
        ];
    }
  };

  const navigationItems = getNavigationItems();
  
  return (
    <div className="h-full overflow-y-auto">
      <nav className="space-y-1 p-3">
        {navigationItems.map((item) => (
          <motion.div key={item.path} whileHover={{ x: collapsed ? 0 : 3 }} transition={{ duration: 0.2 }}>
            <Button
              variant={isActive(item.path) ? "secondary" : "ghost"}
              className={cn(
                "w-full transition-all duration-200",
                collapsed ? 'px-0 justify-center h-12' : 'justify-start h-11 px-3',
                isActive(item.path) && "bg-primary/10 text-primary border-primary/20"
              )}
              asChild
            >
              <Link to={item.path} className="flex items-center gap-3">
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span className="truncate font-medium">{item.label}</span>}
              </Link>
            </Button>
          </motion.div>
        ))}
      </nav>
    </div>
  );
};

export default SideNav;
