
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileText, MessageSquare, Home, ChevronRight, ChevronDown, Settings, UserCircle, HeartPulse, Stethoscope } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SideNavProps {
  collapsed?: boolean;
}

const SideNav = ({ collapsed = false }: SideNavProps) => {
  const location = useLocation();
  const { toast } = useToast();
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

  const handleComingSoonClick = (feature: string) => {
    toast({
      title: "Coming Soon",
      description: `The ${feature} feature will be available soon!`,
    });
  };
  
  return (
    <div className="h-full overflow-y-auto">
      <nav className="p-4 space-y-4">
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
            <Button
              variant={isActive("/profile") ? "secondary" : "ghost"}
              className={`w-full justify-start ${collapsed ? 'px-0 justify-center' : ''}`}
              asChild
            >
              <Link to="/profile">
                <UserCircle className="h-4 w-4" />
                {!collapsed && <span className="ml-2">Profile</span>}
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

            <Button
              variant={isActive("/symptom-checker") ? "secondary" : "ghost"}
              className={`w-full justify-start ${collapsed ? 'px-0 justify-center' : ''}`}
              asChild
            >
              <Link to="/symptom-checker">
                <Stethoscope className="h-4 w-4" />
                {!collapsed && <span className="ml-2">Symptom Checker</span>}
              </Link>
            </Button>

            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? 'px-0 justify-center' : ''}`}
              onClick={() => handleComingSoonClick("Vital Signs")}
            >
              <HeartPulse className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Vital Signs</span>}
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
            <Button
              variant="ghost"
              className={`w-full justify-start ${collapsed ? 'px-0 justify-center' : ''}`}
              onClick={() => handleComingSoonClick("Settings")}
            >
              <Settings className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Settings</span>}
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </nav>
    </div>
  );
};

export default SideNav;
