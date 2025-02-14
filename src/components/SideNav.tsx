
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileText, MessageSquare, Home } from "lucide-react";

const SideNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white border-r border-gray-200 p-4">
      <nav className="space-y-2">
        <Button
          variant={isActive("/home") ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link to="/home">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </Button>
        
        <Button
          variant={isActive("/health-records") ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link to="/health-records">
            <FileText className="mr-2 h-4 w-4" />
            Health Records
          </Link>
        </Button>
        
        <Button
          variant={isActive("/appointments") ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link to="/appointments">
            <CalendarDays className="mr-2 h-4 w-4" />
            Appointments
          </Link>
        </Button>
        
        <Button
          variant={isActive("/messages") ? "secondary" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link to="/messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </Link>
        </Button>
      </nav>
    </div>
  );
};

export default SideNav;
