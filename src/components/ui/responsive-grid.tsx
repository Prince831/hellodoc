import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  className?: string;
}

const ResponsiveGrid = ({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = { mobile: 4, tablet: 4, desktop: 6 },
  className 
}: ResponsiveGridProps) => {
  const isMobile = useIsMobile();

  const getGridCols = () => {
    if (isMobile) return `grid-cols-${cols.mobile}`;
    return `grid-cols-${cols.mobile} md:grid-cols-${cols.tablet} lg:grid-cols-${cols.desktop}`;
  };

  const getGap = () => {
    if (isMobile) return `gap-${gap.mobile}`;
    return `gap-${gap.mobile} md:gap-${gap.tablet} lg:gap-${gap.desktop}`;
  };

  return (
    <div className={cn(
      "grid w-full",
      getGridCols(),
      getGap(),
      className
    )}>
      {children}
    </div>
  );
};

export default ResponsiveGrid;