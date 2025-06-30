
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, FileText, MessageSquare, Home, 
  Settings, UserCircle, Stethoscope
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SideNavProps {
  collapsed?: boolean;
}

const SideNav = ({ collapsed = false }: SideNavProps) => {
  const location = useLocation();
  const { toast } = useToast();
  
  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/profile", icon: UserCircle, label: "Profile" },
    { path: "/health-records", icon: FileText, label: "Health Records" },
    { path: "/appointments", icon: CalendarDays, label: "Appointments" },
    { path: "/symptom-checker", icon: Stethoscope, label: "Symptom Checker" },
    { path: "/messages", icon: MessageSquare, label: "Messages" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];
  
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
