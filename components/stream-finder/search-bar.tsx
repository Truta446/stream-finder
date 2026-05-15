"use client"

import { Search } from "lucide-react"
import type { Ref } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  className?: string
  size?: "default" | "large"
  inputRef?: Ref<HTMLInputElement>
  autoFocus?: boolean
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search for movies or TV shows...",
  className,
  size = "default",
  inputRef,
  autoFocus,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit()
    }
  }

  return (
    <div className={cn("relative w-full", className)}>
      <Search
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none",
          size === "large" ? "h-6 w-6" : "h-5 w-5"
        )}
        aria-hidden
      />
      <Input
        ref={inputRef}
        type="search"
        inputMode="search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="search"
        maxLength={100}
        autoFocus={autoFocus}
        aria-label="Search movies and TV shows"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "w-full bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:bg-secondary focus:border-primary/50 transition-all duration-200",
          size === "large"
            ? "h-14 sm:h-16 pl-12 sm:pl-14 pr-4 sm:pr-6 text-base sm:text-lg rounded-2xl"
            : "h-11 sm:h-12 pl-11 sm:pl-12 pr-4 text-sm sm:text-base rounded-xl"
        )}
      />
    </div>
  )
}
