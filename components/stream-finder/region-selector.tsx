"use client"

import { ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { REGIONS as regions } from "@/lib/api/types"

interface RegionSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function RegionSelector({ value, onChange }: RegionSelectorProps) {
  const selectedRegion = regions.find((r) => r.code === value) || regions[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          aria-label={`Region: ${selectedRegion.name}. Change region.`}
          className="h-10 sm:h-12 px-2 sm:px-4 bg-secondary/50 border-border/50 text-foreground hover:bg-secondary hover:text-foreground hover:border-primary/50 focus-visible:text-foreground data-[state=open]:bg-secondary data-[state=open]:text-foreground transition-all duration-200 gap-1.5 sm:gap-2"
        >
          <Globe className="h-4 w-4 text-muted-foreground" aria-hidden />
          <span className="text-lg" aria-hidden>{selectedRegion.flag}</span>
          <span className="hidden md:inline">{selectedRegion.name}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-52 bg-popover border-border max-h-[min(60vh,420px)] overflow-y-auto"
      >
        {regions.map((region) => (
          <DropdownMenuItem
            key={region.code}
            onClick={() => onChange(region.code)}
            className={`gap-3 cursor-pointer ${
              region.code === value ? "bg-accent" : ""
            }`}
          >
            <span className="text-lg">{region.flag}</span>
            <span>{region.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
