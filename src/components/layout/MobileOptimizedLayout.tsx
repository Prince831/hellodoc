import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

const MobileOptimizedLayout = ({ 
  children, 
  sidebar, 
  header, 
  className 
}: MobileOptimizedLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header */}
      {header && (
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          {header}
        </div>
      )}

      <div className="flex">
        {/* Sidebar - Hidden on mobile or shown as overlay */}
        {sidebar && !isMobile && (
          <div className="w-64 flex-shrink-0 border-r bg-card">
            {sidebar}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <main className={cn(
            "container mx-auto",
            isMobile ? "px-4 py-4" : "px-6 py-6"
          )}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MobileOptimizedLayout;