
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "muted" | "success" | "warning" | "destructive";
  text?: string;
  className?: string;
  showText?: boolean;
  centered?: boolean;
}

const Loading = ({
  size = "md",
  variant = "primary",
  text = "Loading...",
  className,
  showText = true,
  centered = false,
}: LoadingProps) => {
  const sizeClasses = {
    xs: "h-3 w-3 border-[1.5px]",
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-[3px]",
    xl: "h-16 w-16 border-[4px]",
  };

  const variantClasses = {
    primary: "border-b-primary",
    secondary: "border-b-secondary",
    muted: "border-b-muted-foreground",
    success: "border-b-green-500",
    warning: "border-b-yellow-500",
    destructive: "border-b-red-500",
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center", 
      centered && "h-full w-full min-h-[100px]",
      className
    )}>
      <div
        className={cn(
          "animate-spin rounded-full border-transparent",
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {showText && text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

export default Loading;

export const SkeletonCard = ({ 
  className, 
  height = "h-32"
}: { 
  className?: string;
  height?: string;
}) => {
  return (
    <div
      className={cn(
        "rounded-md border p-4 bg-muted/20 animate-pulse",
        height,
        className
      )}
    />
  );
};

export const LoadingScreen = ({ 
  message = "Loading...",
  variant = "primary"
}: { 
  message?: string;
  variant?: "primary" | "secondary" | "muted" | "success" | "warning" | "destructive";
}) => {
  return (
    <div className="flex items-center justify-center h-full w-full min-h-[200px]">
      <div className="text-center">
        <Loading size="lg" variant={variant} showText={false} />
        <p className="mt-4 text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export const LoadingDots = ({ 
  className, 
  size = "sm",
  variant = "primary" 
}: { 
  className?: string;
  size?: "xs" | "sm" | "md";
  variant?: "primary" | "secondary" | "muted" | "success" | "warning" | "destructive";
}) => {
  const sizeClasses = {
    xs: "h-1 w-1 mx-0.5",
    sm: "h-2 w-2 mx-1",
    md: "h-2.5 w-2.5 mx-1.5",
  };
  
  const variantClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    muted: "bg-muted-foreground",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    destructive: "bg-red-500",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-full animate-pulse",
            sizeClasses[size],
            variantClasses[variant],
            { "animation-delay-200": i === 1, "animation-delay-400": i === 2 }
          )}
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
};

export const LoadingOverlay = ({
  message = "Processing...",
  transparent = false,
  variant = "primary",
}: {
  message?: string;
  transparent?: boolean;
  variant?: "primary" | "secondary" | "muted" | "success" | "warning" | "destructive";
}) => {
  return (
    <div 
      className={cn(
        "fixed inset-0 flex flex-col items-center justify-center z-50", 
        transparent ? "bg-background/50" : "bg-background/80",
        "backdrop-blur-sm"
      )}
    >
      <Loading size="xl" variant={variant} showText={false} />
      <p className="mt-4 text-lg font-medium">{message}</p>
    </div>
  );
};
