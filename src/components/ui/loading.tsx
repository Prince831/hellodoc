
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "muted";
  text?: string;
  className?: string;
}

const Loading = ({
  size = "md",
  variant = "primary",
  text,
  className,
}: LoadingProps) => {
  const sizeClasses = {
    xs: "h-4 w-4 border-2",
    sm: "h-6 w-6 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-[3px]",
  };

  const variantClasses = {
    primary: "border-b-primary",
    secondary: "border-b-secondary",
    muted: "border-b-muted-foreground",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-transparent",
          sizeClasses[size],
          variantClasses[variant]
        )}
      />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

export default Loading;

export const SkeletonCard = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "rounded-md border p-4 bg-muted/20 animate-pulse",
        className
      )}
    />
  );
};

export const LoadingScreen = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="flex items-center justify-center h-full w-full min-h-[200px]">
      <div className="text-center">
        <Loading size="lg" />
        <p className="mt-4 text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};
