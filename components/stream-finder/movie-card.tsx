"use client"

import { memo } from "react"
import Link from "next/link"
import { Star, Play, Film, Tv } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PosterImage } from "@/components/ui/poster-image"
import { buildTitleUrl } from "@/lib/utils/slug"
import type { Title } from "@/lib/api/types"

interface MovieCardProps {
  title: Title
  /** Mark above-the-fold cards so Next.js loads the poster eagerly and preloads it. */
  priority?: boolean
  /**
   * Only the single most likely LCP element should get fetchpriority="high" —
   * handing it to every card in the first row makes them compete for bandwidth
   * and pushes the actual LCP later. Defaults to "auto" for priority cards.
   */
  fetchPriority?: "high" | "auto"
}

function MovieCardImpl({ title, priority = false, fetchPriority = "auto" }: MovieCardProps) {
  const locale = useLocale()
  const t = useTranslations()
  const href = buildTitleUrl(locale, title.type as "movie" | "tv", title.title, title.id)

  return (
    <Link href={href} prefetch>
      <Card
        className="group overflow-hidden bg-card border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10"
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <PosterImage
            src={title.poster}
            alt={`${title.title} poster`}
            fill
            priority={priority}
            fetchPriority={fetchPriority}
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
            {title.type === "movie" ? t("details.movie") : t("details.tvShow")}
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
                {title.type === "movie"
                  ? title.runtime
                  : t("details.seasons", { count: title.seasons ?? 0 })}
              </>
            )}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {title.description || t("details.noDescription")}
          </p>
          <Button
            variant="secondary"
            className="w-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            tabIndex={-1}
          >
            {t("details.whereToWatch")}
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}

export const MovieCard = memo(MovieCardImpl)
