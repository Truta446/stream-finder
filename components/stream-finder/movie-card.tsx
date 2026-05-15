"use client"

import { memo } from "react"
import { Star, Play, Film, Tv } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PosterImage } from "@/components/ui/poster-image"
import type { Title } from "@/lib/api/types"

interface MovieCardProps {
  title: Title
  onClick: () => void
  onHover?: () => void
  /** Mark above-the-fold cards so Next.js gives the poster eager + high fetchpriority. */
  priority?: boolean
}

function MovieCardImpl({ title, onClick, onHover, priority = false }: MovieCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`${title.title}, ${title.year}, rating ${title.rating.toFixed(1)}. View availability.`}
      className="group overflow-hidden bg-card border-border/50 hover:border-primary/50 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10"
      onClick={onClick}
      onMouseEnter={onHover}
      onFocus={onHover}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <PosterImage
          src={title.poster}
          alt={`${title.title} poster`}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-primary/90 rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="h-8 w-8 text-primary-foreground fill-primary-foreground" />
          </div>
        </div>
        <Badge
          className="absolute top-3 left-3 bg-black/70 text-foreground border-0 gap-1.5"
          variant="secondary"
        >
          {title.type === "movie" ? (
            <Film className="h-3 w-3" />
          ) : (
            <Tv className="h-3 w-3" />
          )}
          {title.type === "movie" ? "Movie" : "TV Show"}
        </Badge>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 rounded-full px-2 py-1">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-foreground">
            {title.rating.toFixed(1)}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground text-balance line-clamp-1 mb-1 group-hover:text-primary transition-colors">
          {title.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          {title.year || "—"}
          {(title.type === "movie" ? title.runtime : title.seasons) && (
            <>
              {" • "}
              {title.type === "movie" ? title.runtime : `${title.seasons} Seasons`}
            </>
          )}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {title.description || "No description available."}
        </p>
        <Button
          variant="secondary"
          className="w-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
        >
          View availability
        </Button>
      </CardContent>
    </Card>
  )
}

export const MovieCard = memo(MovieCardImpl)
