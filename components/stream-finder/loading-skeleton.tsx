import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  count?: number
  className?: string
}

export function LoadingSkeleton({ count = 6, className }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-xl overflow-hidden border border-border/50 animate-pulse"
        >
          <div className="aspect-[2/3] bg-secondary" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-secondary rounded w-3/4" />
            <div className="h-4 bg-secondary rounded w-1/2" />
            <div className="space-y-2">
              <div className="h-3 bg-secondary rounded" />
              <div className="h-3 bg-secondary rounded w-5/6" />
            </div>
            <div className="h-9 bg-secondary rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
