import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "default" | "glass";
}

export function LoadingSkeleton({
  className,
  variant = "default",
}: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg",
        variant === "glass" && "bg-white/5 backdrop-blur-sm",
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="h-full w-full bg-white/5" />
    </div>
  );
}

export function LoadingCard({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 rounded-lg glass", className)}>
      <div className="space-y-4">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-4 w-1/2" />
        <LoadingSkeleton className="h-4 w-2/3" />
        <LoadingSkeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

export function LoadingList({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 rounded-lg glass"
        >
          <LoadingSkeleton className="h-4 w-1/3" />
          <LoadingSkeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}
