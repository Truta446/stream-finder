"use client"

import { PosterImage } from "@/components/ui/poster-image"
import { POPULAR_PLATFORMS } from "@/lib/api/types"
import { cn } from "@/lib/utils"

interface PlatformBadgesProps {
  className?: string
  selected: ReadonlySet<string>
  onToggle: (id: string) => void
}

export function PlatformBadges({ className, selected, onToggle }: PlatformBadgesProps) {
  return (
    <div
      className={cn("flex flex-wrap justify-center gap-2 sm:gap-3", className)}
      role="group"
      aria-label="Filter by streaming provider"
    >
      {POPULAR_PLATFORMS.map((platform) => {
        const isSelected = selected.has(platform.id)
        return (
          <button
            key={platform.id}
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            aria-label={`Filter by ${platform.name}`}
            onClick={() => onToggle(platform.id)}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
              isSelected
                ? "bg-primary/15 border-primary text-foreground"
                : "bg-secondary/50 border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40",
            )}
          >
            <span className="relative h-5 w-5 sm:h-6 sm:w-6 rounded-md overflow-hidden bg-white/10 shrink-0">
              <PosterImage
                src={platform.logo}
                alt=""
                fill
                showSkeleton={false}
                fallbackIconSize={12}
                className="object-cover"
                sizes="24px"
              />
            </span>
            <span className="hidden sm:inline">{platform.name}</span>
            <span className="sm:hidden">{platform.name.split(" ")[0]}</span>
          </button>
        )
      })}
    </div>
  )
}
