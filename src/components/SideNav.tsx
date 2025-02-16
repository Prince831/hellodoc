
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileText, MessageSquare, Home } from "lucide-react";

interface SideNavProps {
  collapsed?: boolean;
}

const SideNav = ({ collapsed = false }: SideNavProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className={`fixed left-0 top-16 h-full bg-white border-r border-gray-200 p-4 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <nav className="space-y-2">
        <Button
          variant={isActive("/home") ? "secondary" : "ghost"}
          className={`w-full justify-start ${collapsed ? 'px-0 justify-center' : ''}`}
          asChild
        >
          <Link to="/home">
            <Home className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Home</span>}
          </Link>
        </Button>
        
        <Button
          variant={isActive("/health-records") ? "secondary" : "ghost"}
          className={`w-full justify-start ${collapsed ? 'px-0 justify-center' : ''}`}
          asChild
        >
          <Link to="/health-records">
            <FileText className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Health Records</span>}
          </Link>
        </Button>
        
        <Button
          variant={isActive("/appointments") ? "secondary" : "ghost"}
          className={`w-full justify-start ${collapsed ? 'px-0 justify-center' : ''}`}
          asChild
        >
          <Link to="/appointments">
            <CalendarDays className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Appointments</span>}
          </Link>
        </Button>
        
        <Button
          variant={isActive("/messages") ? "secondary" : "ghost"}
          className={`w-full justify-start ${collapsed ? 'px-0 justify-center' : ''}`}
          asChild
        >
          <Link to="/messages">
            <MessageSquare className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Messages</span>}
          </Link>
        </Button>
      </nav>
    </div>
  );
};

export default SideNav;
