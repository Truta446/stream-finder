"use client"

import { useState } from "react"
import { ExternalLink, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { RegionSelector } from "./region-selector"
import { ProviderCard } from "./provider-card"
import { useRegion } from "@/hooks/use-region"
import { REGIONS } from "@/lib/api/types"
import type { StreamingProvider } from "@/lib/api/types"

interface ProvidersSectionProps {
  providers: Record<string, StreamingProvider[]>
  titleText: string
  initialRegion?: string
}

export function ProvidersSection({ providers, titleText, initialRegion }: ProvidersSectionProps) {
  const t = useTranslations()
  const [storedRegion, persistRegion] = useRegion()
  // localRegion holds an explicit user pick on this page; null means "follow localStorage"
  const [localRegion, setLocalRegion] = useState<string | null>(initialRegion ?? null)
  const region = localRegion ?? storedRegion

  const handleRegionChange = (code: string) => {
    setLocalRegion(code)
    persistRegion(code)
  }

  const selectedRegion = REGIONS.find((r) => r.code === region)
  const regionProviders = providers[region] ?? []

  const grouped = {
    subscription: regionProviders.filter((p) => p.type === "subscription"),
    rent: regionProviders.filter((p) => p.type === "rent"),
    buy: regionProviders.filter((p) => p.type === "buy"),
    free: regionProviders.filter((p) => p.type === "free"),
  }

  const justWatchUrl = `https://www.justwatch.com/${region.toLowerCase()}/search?q=${encodeURIComponent(titleText)}`

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <h2 className="text-xl font-semibold text-foreground">
          {t("details.whereToWatchIn", { region: `${selectedRegion?.flag} ${selectedRegion?.name}` })}
        </h2>
        <RegionSelector value={region} onChange={handleRegionChange} />
      </div>

      {regionProviders.length === 0 ? (
        <div className="text-center py-10 bg-secondary/30 rounded-xl border border-border/50 px-4">
          <p className="text-muted-foreground text-base mb-2">{t("details.noData")}</p>
          <p className="text-sm text-muted-foreground/70 mb-4">
            {t("details.noDataDesc", { region: selectedRegion?.name ?? region })}
          </p>
          <a
            href={justWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            {t("details.searchOnJustWatch", { title: titleText })}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.subscription.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">
                {t("providers.subscription")}
              </h3>
              <div className="grid gap-3">
                {grouped.subscription.map((p) => (
                  <ProviderCard key={`${p.id}-${p.type}`} provider={p} />
                ))}
              </div>
            </div>
          )}
          {grouped.rent.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-amber-400 mb-3 uppercase tracking-wider">
                {t("providers.rent")}
              </h3>
              <div className="grid gap-3">
                {grouped.rent.map((p) => (
                  <ProviderCard key={`${p.id}-${p.type}`} provider={p} />
                ))}
              </div>
            </div>
          )}
          {grouped.buy.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-blue-400 mb-3 uppercase tracking-wider">
                {t("providers.buy")}
              </h3>
              <div className="grid gap-3">
                {grouped.buy.map((p) => (
                  <ProviderCard key={`${p.id}-${p.type}`} provider={p} />
                ))}
              </div>
            </div>
          )}
          {grouped.free.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-emerald-400 mb-3 uppercase tracking-wider">
                {t("providers.free")}
              </h3>
              <div className="grid gap-3">
                {grouped.free.map((p) => (
                  <ProviderCard key={`${p.id}-${p.type}`} provider={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
