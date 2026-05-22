"use client"

import { useTransition } from "react"
import { ChevronDown, Languages } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { routing } from "@/i18n/routing"

type Locale = (typeof routing.locales)[number]

const LANGUAGES: { code: Locale; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
  { code: "pt-BR", label: "Português (BR)", short: "PT" },
]

export function LanguageSelector() {
  const t = useTranslations("language")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0]

  const switchTo = (next: Locale) => {
    if (next === locale) return

    const otherLocales = routing.locales.filter((l) => l !== routing.defaultLocale)
    const segments = pathname.split("/").filter(Boolean)
    if (segments.length > 0 && (otherLocales as readonly string[]).includes(segments[0])) {
      segments.shift()
    }

    const rest = segments.join("/")
    const base = next === routing.defaultLocale ? "" : `/${next}`
    const path = rest ? `${base}/${rest}` : base || "/"

    const qs = searchParams.toString()
    const url = qs ? `${path}?${qs}` : path

    startTransition(() => {
      router.replace(url, { scroll: false })
      router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          aria-label={t("current", { name: current.label })}
          disabled={isPending}
          className="h-10 sm:h-12 px-2 sm:px-3 bg-secondary/50 border-border/50 text-foreground hover:bg-secondary hover:text-foreground hover:border-primary/50 focus-visible:text-foreground data-[state=open]:bg-secondary data-[state=open]:text-foreground transition-all duration-200 gap-1 sm:gap-1.5"
        >
          <Languages className="h-4 w-4 text-muted-foreground" aria-hidden />
          <span className="text-xs font-semibold tracking-wide">{current.short}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => switchTo(lang.code)}
            className={`gap-3 cursor-pointer ${lang.code === locale ? "bg-accent" : ""}`}
          >
            <span className="text-xs font-mono text-muted-foreground w-8">{lang.short}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
