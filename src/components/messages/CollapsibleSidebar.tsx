
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SideNav from "@/components/SideNav";

interface CollapsibleSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ collapsed, onToggle }) => {
  return (
    <div className={`transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} border-r border-border bg-background h-[calc(100vh-4rem)]`}>
      <SideNav collapsed={collapsed} />
      <Button
        variant="ghost"
        size="icon"
        className={`fixed ${
          collapsed ? 'left-16' : 'left-64'
        } top-24 transform z-50 bg-background/80 backdrop-blur hover:bg-muted/50 transition-all duration-300 shadow-sm`}
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default CollapsibleSidebar;
