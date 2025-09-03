import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}

const MobileCard = ({ 
  title, 
  description, 
  children, 
  className,
  compact = false
}: MobileCardProps) => {
  const isMobile = useIsMobile();

  return (
    <Card className={cn(
      "w-full transition-all duration-200",
      isMobile && "border-0 shadow-none bg-transparent",
      className
    )}>
      {(title || description) && (
        <CardHeader className={cn(
          isMobile && compact && "px-0 py-2",
          isMobile && !compact && "px-0 py-4"
        )}>
          {title && (
            <CardTitle className={cn(
              isMobile && "text-lg"
            )}>
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className={cn(
              isMobile && "text-sm"
            )}>
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={cn(
        isMobile && "px-0 pb-0"
      )}>
        {children}
      </CardContent>
    </Card>
  );
};

export default MobileCard;