"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

export type MediaType = "all" | "movie" | "tv"

interface TypeToggleProps {
  value: MediaType
  onChange: (value: MediaType) => void
  className?: string
}

export function TypeToggle({ value, onChange, className }: TypeToggleProps) {
  const t = useTranslations("filters")
  const options: Array<{ value: MediaType; label: string }> = [
    { value: "all", label: t("all") },
    { value: "movie", label: t("movies") },
    { value: "tv", label: t("tv") },
  ]

  return (
    <div
      role="radiogroup"
      aria-label={t("mediaType")}
      className={cn(
        "inline-flex items-center rounded-full border border-border/50 bg-secondary/40 p-0.5 text-sm",
        className,
      )}
    >
      {options.map((opt) => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              "px-3 py-1 rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
              selected
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
