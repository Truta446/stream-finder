"use client"

import { Search, Film } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  type: "no-search" | "no-results" | "no-availability"
  query?: string
  className?: string
}

export function EmptyState({ type, query, className }: EmptyStateProps) {
  const t = useTranslations("empty")

  const content = {
    "no-search": {
      icon: Search,
      title: t("searchTitle"),
      description: t("searchDesc"),
    },
    "no-results": {
      icon: Film,
      title: t("noResultsTitle"),
      description: query ? t("noResultsDesc", { query }) : t("noResultsDescGeneric"),
    },
    "no-availability": {
      icon: Film,
      title: t("noAvailabilityTitle"),
      description: t("noAvailabilityDesc"),
    },
  }

  const { icon: Icon, title, description } = content[type]

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className,
      )}
    >
      <div className="bg-secondary/50 rounded-full p-6 mb-6">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </div>
  )
}
