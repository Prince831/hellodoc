import { Link, useLocation } from "react-router-dom";
import {
  CalendarDays, FileText, MessageSquare, Home,
  Settings, UserCircle, Stethoscope, Video,
  PillIcon, Monitor,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SideNavProps {
  collapsed?: boolean;
}

const navigationItems = [
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

const SideNav = ({ collapsed = false }: SideNavProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-full overflow-y-auto scene-3d">
      <nav className="space-y-1.5 p-3">
        {navigationItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-300 ease-smooth",
                collapsed ? "h-12 justify-center px-0" : "h-11 px-3",
                active
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:-translate-y-0.5 hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidenav-active"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  className="absolute inset-0 rounded-xl bg-gradient-primary shadow-glow"
                />
              )}
              <item.icon className={cn("relative z-10 h-4 w-4 flex-shrink-0 transition-transform duration-300", !active && "group-hover:scale-110")} />
              {!collapsed && <span className="relative z-10 truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default SideNav;
