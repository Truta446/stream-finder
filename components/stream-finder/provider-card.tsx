"use client"

import { ExternalLink } from "lucide-react"
import { useTranslations } from "next-intl"
import { PosterImage } from "@/components/ui/poster-image"
import type { StreamingProvider } from "@/lib/api/types"
import { cn } from "@/lib/utils"

interface ProviderCardProps {
  provider: StreamingProvider
  className?: string
}

export function ProviderCard({ provider, className }: ProviderCardProps) {
  const t = useTranslations()

  const typeColors = {
    subscription: "bg-primary/20 text-primary border-primary/30",
    rent: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    buy: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    free: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  }

  const typeLabels = {
    subscription: t("providers.subscription"),
    rent: t("providers.rent"),
    buy: t("providers.buy"),
    free: t("providers.free"),
  }

  return (
    <a
      href={provider.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-4 p-4 bg-secondary/50 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-secondary transition-all duration-200 group",
        className,
      )}
    >
      <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
        <PosterImage
          src={provider.logo}
          alt={provider.name}
          fill
          showSkeleton={false}
          fallbackIconSize={20}
          className="object-cover"
          sizes="56px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-foreground truncate">{provider.name}</h4>
        <span
          className={cn(
            "inline-block text-xs px-2 py-0.5 rounded-full border mt-1",
            typeColors[provider.type],
          )}
        >
          {typeLabels[provider.type]}
        </span>
      </div>
      <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-sm font-medium hidden sm:inline">{t("details.watchNow")}</span>
        <ExternalLink className="h-4 w-4" />
      </div>
    </a>
  )
}
