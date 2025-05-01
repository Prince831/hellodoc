
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SideNav from "@/components/SideNav";
import { motion } from "framer-motion";

interface CollapsibleSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const SIDEBAR_STATE_KEY = "hellodoc-sidebar-collapsed";

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ collapsed, onToggle }) => {
  return (
    <motion.div 
      className={`transition-all duration-300 fixed left-0 top-0 pt-16 h-full ${collapsed ? 'w-16' : 'w-64'} border-r border-border bg-background z-20`}
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="h-full overflow-y-auto">
        <SideNav collapsed={collapsed} />
      </div>
      <Button
        variant="secondary"
        size="icon"
        className={`fixed ${
          collapsed ? 'left-16' : 'left-64'
        } top-1/2 transform -translate-y-1/2 z-30 bg-background/80 backdrop-blur hover:bg-muted/50 transition-all duration-300 shadow-md border border-border`}
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
