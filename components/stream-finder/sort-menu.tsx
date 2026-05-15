"use client"

import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type SortKey = "popularity" | "rating" | "year" | "title"

const LABELS: Record<SortKey, string> = {
  popularity: "Popularity",
  rating: "Rating",
  year: "Year",
  title: "Title A-Z",
}

interface SortMenuProps {
  value: SortKey
  onChange: (key: SortKey) => void
}

export function SortMenu({ value, onChange }: SortMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label={`Sort by ${LABELS[value]}`}
          className="bg-secondary/40 border-border/50 text-foreground hover:bg-secondary hover:text-foreground hover:border-primary/40 data-[state=open]:bg-secondary data-[state=open]:text-foreground gap-2"
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          <span className="hidden sm:inline">Sort:</span>
          <span>{LABELS[value]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 bg-popover border-border">
        {(Object.keys(LABELS) as SortKey[]).map((key) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onChange(key)}
            className={value === key ? "bg-accent text-accent-foreground" : "cursor-pointer"}
          >
            {LABELS[key]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
