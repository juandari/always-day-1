import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "glass";
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export function Loading({
  className,
  size = "md",
  variant = "default",
}: LoadingProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        variant === "glass" && "p-4 rounded-lg bg-white/5 backdrop-blur-sm",
        className
      )}
    >
      <Loader2
        className={cn(
          "animate-spin text-primary",
          sizeClasses[size],
          variant === "glass" && "text-primary/80"
        )}
      />
    </div>
  );
}
