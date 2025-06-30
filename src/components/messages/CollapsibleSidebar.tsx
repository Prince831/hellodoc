
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SideNav from "@/components/SideNav";
import { motion } from "framer-motion";

interface CollapsibleSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ collapsed, onToggle }) => {
  return (
    <motion.div 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] ${collapsed ? 'w-16' : 'w-64'} border-r border-border bg-background z-30 flex flex-col`}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex-1 overflow-hidden">
        <SideNav collapsed={collapsed} />
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-40 bg-background/95 backdrop-blur hover:bg-muted/80 transition-all duration-300 shadow-md border border-border"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </motion.div>
  );
};

export default CollapsibleSidebar;
