
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, FileText, MessageSquare, Home, 
  Settings, UserCircle, Stethoscope
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface SideNavProps {
  collapsed?: boolean;
}

const SideNav = ({ collapsed = false }: SideNavProps) => {
  const location = useLocation();
  const { toast } = useToast();
  
  const isActive = (path: string) => location.pathname === path;

  const handleComingSoonClick = (feature: string) => {
    toast({
      title: "Coming Soon",
      description: `The ${feature} feature will be available soon!`,
      duration: 3000,
    });
  };

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
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent pb-24">
      <nav className="space-y-2 p-4">
        {navigationItems.map((item) => (
          <motion.div key={item.path} whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
            <Button
              variant={isActive(item.path) ? "secondary" : "ghost"}
              className={`w-full justify-start ${collapsed ? 'px-0 justify-center' : ''}`}
              asChild
            >
              <Link to={item.path}>
                <item.icon className="h-4 w-4" />
                {!collapsed && <span className="ml-2">{item.label}</span>}
              </Link>
            </Button>
          </motion.div>
        ))}
      </nav>
    </div>
  );
};

export default SideNav;
