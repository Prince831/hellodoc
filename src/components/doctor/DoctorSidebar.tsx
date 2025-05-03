
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, Users, MessageSquare, Video, 
  Clipboard, Heart, FileText, Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DoctorSidebarProps {
  className?: string;
}

const DoctorSidebar = ({ className }: DoctorSidebarProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      name: "Dashboard",
      path: "/doctor-dashboard",
      icon: <Clipboard className="h-4 w-4" />
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
    <div className={cn("border rounded-lg p-4 space-y-2", className)}>
      <h2 className="text-xl font-semibold mb-4 px-2">Doctor Portal</h2>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant={isActive(item.path) ? "secondary" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link to={item.path}>
              {item.icon}
              <span className="ml-2">{item.name}</span>
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  );
};

export default DoctorSidebar;
