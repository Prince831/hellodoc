
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileText, MessageSquare, Home, ChevronRight, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface SideNavProps {
  collapsed?: boolean;
}

const SideNav = ({ collapsed = false }: SideNavProps) => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    main: true,
    communication: true,
    health: true
  });
  
  const isActive = (path: string) => location.pathname === path;

  const toggleSection = (section: string) => {
    if (!collapsed) {
      setOpenSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    }
  };
  
  return (
    <div className={`fixed left-0 top-16 h-full bg-background/80 backdrop-blur-sm border-r border-border p-4 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <nav className="space-y-4">
        {/* Main Navigation */}
        <Collapsible 
          open={openSections.main} 
          onOpenChange={() => toggleSection('main')}
        >
          <CollapsibleTrigger asChild>
            <div className={`flex items-center justify-between mb-2 ${collapsed ? 'justify-center' : ''}`}>
              {!collapsed && (
                <>
                  <span className="text-sm font-semibold">Main Navigation</span>
                  {openSections.main ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </>
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
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
          </CollapsibleContent>
        </Collapsible>

        {/* Health Section */}
        <Collapsible 
          open={openSections.health} 
          onOpenChange={() => toggleSection('health')}
        >
          <CollapsibleTrigger asChild>
            <div className={`flex items-center justify-between mb-2 ${collapsed ? 'justify-center' : ''}`}>
              {!collapsed && (
                <>
                  <span className="text-sm font-semibold">Health</span>
                  {openSections.health ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </>
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
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
          </CollapsibleContent>
        </Collapsible>

        {/* Communication Section */}
        <Collapsible 
          open={openSections.communication} 
          onOpenChange={() => toggleSection('communication')}
        >
          <CollapsibleTrigger asChild>
            <div className={`flex items-center justify-between mb-2 ${collapsed ? 'justify-center' : ''}`}>
              {!collapsed && (
                <>
                  <span className="text-sm font-semibold">Communication</span>
                  {openSections.communication ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </>
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
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
          </CollapsibleContent>
        </Collapsible>
      </nav>
    </div>
  );
};

export default SideNav;
