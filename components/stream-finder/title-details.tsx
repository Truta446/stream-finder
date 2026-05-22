"use client"

import { useEffect, useRef } from "react"
import { X, Star, Clock, Film, Tv, Calendar, Loader2, ExternalLink, PlayCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PosterImage } from "@/components/ui/poster-image"
import type { Title } from "@/lib/api/types"
import { REGIONS } from "@/lib/api/types"
import { ProviderCard } from "./provider-card"

interface TitleDetailsProps {
  title: Title
  region: string
  isLoading?: boolean
  onClose: () => void
}

export function TitleDetails({ title, region, isLoading, onClose }: TitleDetailsProps) {
  const t = useTranslations()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const selectedRegion = REGIONS.find((r) => r.code === region)
  const providers = title.providers[region] || []

  const groupedProviders = {
    subscription: providers.filter((p) => p.type === "subscription"),
    rent: providers.filter((p) => p.type === "rent"),
    buy: providers.filter((p) => p.type === "buy"),
    free: providers.filter((p) => p.type === "free"),
  }

  const hasProviders = providers.length > 0
  const justWatchSearchUrl = `https://www.justwatch.com/${region.toLowerCase()}/search?q=${encodeURIComponent(title.title)}`
  const regionLabel = `${selectedRegion?.flag} ${selectedRegion?.name}`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="title-details-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-4xl h-[95vh] sm:h-[90vh] bg-card rounded-2xl overflow-hidden shadow-2xl border border-border/50 animate-in fade-in zoom-in-95 duration-200">
        <Button
          ref={closeRef}
          variant="ghost"
          size="icon"
          aria-label={t("details.close")}
          className="absolute top-3 right-3 z-20 bg-black/60 hover:bg-black/80 text-foreground rounded-full"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
        {isLoading && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5 text-xs text-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {t("details.loadingDetails")}
          </div>
        )}

        <ScrollArea className="h-full">
          <div className="relative h-40 sm:h-56 md:h-72 w-full bg-secondary/40">
            <PosterImage
              src={title.backdrop}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
              fallbackIconSize={48}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          </div>

          <div className="px-4 sm:px-6 pb-10">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="relative h-44 w-28 sm:h-56 sm:w-36 rounded-xl overflow-hidden shadow-2xl flex-shrink-0 mx-auto sm:mx-0 -mt-20 sm:-mt-24 ring-2 ring-card bg-secondary">
                <PosterImage
                  src={title.poster}
                  alt={`${title.title} poster`}
                  fill
                  className="object-cover"
                  sizes="144px"
                  fallbackIconSize={28}
                />
              </div>

              <div className="flex-1 text-center sm:text-left pt-2 sm:pt-4">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 flex-wrap">
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    {title.type === "movie" ? (
                      <Film className="h-3 w-3 mr-1" />
                    ) : (
                      <Tv className="h-3 w-3 mr-1" />
                    )}
                    {title.type === "movie" ? t("details.movie") : t("details.tvShow")}
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="h-4 w-4 fill-yellow-400" />
                    <span className="font-medium">{title.rating.toFixed(1)}</span>
                  </div>
                </div>

                <h2
                  id="title-details-heading"
                  className="text-2xl sm:text-3xl font-bold text-foreground text-balance mb-2"
                >
                  {title.title}
                </h2>

                <div className="flex items-center justify-center sm:justify-start gap-4 text-muted-foreground text-sm mb-4 flex-wrap">
                  {title.year ? (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {title.year}
                    </span>
                  ) : null}
                  {(title.type === "movie" ? title.runtime : title.seasons) ? (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {title.type === "movie"
                        ? title.runtime
                        : t("details.seasons", { count: title.seasons ?? 0 })}
                    </span>
                  ) : null}
                </div>

                {title.genres.length > 0 && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                    {title.genres.map((genre) => (
                      <Badge key={genre} variant="outline" className="border-border text-muted-foreground">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-muted-foreground leading-relaxed">
                  {title.description || t("details.noDescription")}
                </p>

                {title.trailerKey && (
                  <a
                    href={`https://www.youtube.com/watch?v=${title.trailerKey}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    <PlayCircle className="h-4 w-4" />
                    {t("details.watchTrailer")}
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                  </a>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                {t("details.whereToWatchIn", { region: regionLabel })}
              </h3>

              {isLoading ? (
                <div
                  className="space-y-3"
                  role="status"
                  aria-live="polite"
                  aria-busy="true"
                  aria-label={t("details.loadingAvailability")}
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    {t("details.checkingAvailability")}
                  </div>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl border border-border/50 animate-pulse"
                    >
                      <div className="h-14 w-14 rounded-xl bg-secondary shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-secondary rounded w-1/3" />
                        <div className="h-3 bg-secondary rounded w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !hasProviders ? (
                <div className="text-center py-10 bg-secondary/30 rounded-xl border border-border/50 px-4">
                  <p className="text-muted-foreground text-base mb-2">{t("details.noData")}</p>
                  <p className="text-sm text-muted-foreground/70 mb-4">
                    {t("details.noDataDesc", { region: selectedRegion?.name ?? region })}
                  </p>
                  <a
                    href={justWatchSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    {t("details.searchOnJustWatch", { title: title.title })}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  {groupedProviders.subscription.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">
                        {t("providers.subscription")}
                      </h4>
                      <div className="grid gap-3">
                        {groupedProviders.subscription.map((provider) => (
                          <ProviderCard key={`${provider.id}-${provider.type}`} provider={provider} />
                        ))}
                      </div>
                    </div>
                  )}
                  {groupedProviders.rent.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-amber-400 mb-3 uppercase tracking-wider">
                        {t("providers.rent")}
                      </h4>
                      <div className="grid gap-3">
                        {groupedProviders.rent.map((provider) => (
                          <ProviderCard key={`${provider.id}-${provider.type}`} provider={provider} />
                        ))}
                      </div>
                    </div>
                  )}
                  {groupedProviders.buy.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-blue-400 mb-3 uppercase tracking-wider">
                        {t("providers.buy")}
                      </h4>
                      <div className="grid gap-3">
                        {groupedProviders.buy.map((provider) => (
                          <ProviderCard key={`${provider.id}-${provider.type}`} provider={provider} />
                        ))}
                      </div>
                    </div>
                  )}
                  {groupedProviders.free.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-emerald-400 mb-3 uppercase tracking-wider">
                        {t("providers.free")}
                      </h4>
                      <div className="grid gap-3">
                        {groupedProviders.free.map((provider) => (
                          <ProviderCard key={`${provider.id}-${provider.type}`} provider={provider} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
