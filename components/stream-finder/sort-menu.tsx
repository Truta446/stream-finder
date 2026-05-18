"use client"

import { ArrowUpDown } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type SortKey = "popularity" | "rating" | "year" | "title"

interface SortMenuProps {
  value: SortKey
  onChange: (key: SortKey) => void
}

export function SortMenu({ value, onChange }: SortMenuProps) {
  const t = useTranslations("filters")

  const labels: Record<SortKey, string> = {
    popularity: t("popularity"),
    rating: t("rating"),
    year: t("year"),
    title: t("titleAZ"),
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={t("sortBy", { label: labels[value] })}
          className="bg-secondary/40 border-border/50 text-foreground hover:bg-secondary hover:text-foreground hover:border-primary/40 data-[state=open]:bg-secondary data-[state=open]:text-foreground gap-2"
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          <span className="hidden sm:inline">{t("sort")}:</span>
          <span>{labels[value]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 bg-popover border-border">
        {(Object.keys(labels) as SortKey[]).map((key) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onChange(key)}
            className={value === key ? "bg-accent text-accent-foreground" : "cursor-pointer"}
          >
            {labels[key]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
