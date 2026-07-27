"use client"

import { Play } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { SearchBar } from "./search-bar"
import { RegionSelector } from "./region-selector"
import { LanguageSelector } from "./language-selector"
import { PlatformBadges } from "./platform-badges"
import { LoadingSkeleton } from "./loading-skeleton"

const NOOP = () => {}
const EMPTY_SET: ReadonlySet<string> = new Set()

/**
 * Above-the-fold shell rendered into the static HTML while the interactive
 * home page hydrates. `ReelHuntrInner` reads the URL via `useSearchParams`,
 * so it can only render on the client — without this shell the Suspense
 * fallback would be empty and the page would paint nothing until JS runs,
 * hurting FCP/LCP. This mirrors the initial "no search" view so the swap to
 * the interactive tree is seamless (no layout shift). Handlers are no-ops:
 * the shell is replaced the moment hydration completes.
 */
export function HomeShell() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="ReelHuntr home">
            <div className="bg-primary rounded-lg p-1.5">
              <Play className="h-5 w-5 text-primary-foreground fill-primary-foreground" aria-hidden />
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">ReelHuntr</span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <LanguageSelector />
            <RegionSelector value="US" onChange={NOOP} />
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <section className="relative py-12 sm:py-20 md:py-28" aria-labelledby="hero-title">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1
                id="hero-title"
                className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance mb-4 md:mb-6"
              >
                {t("hero.title")}
              </h1>
              <p className="text-base sm:text-xl text-muted-foreground mb-8 md:mb-10 text-pretty">
                {t("hero.subtitle")}
              </p>
              <div className="max-w-2xl mx-auto mb-8">
                <SearchBar value="" onChange={NOOP} size="large" placeholder={t("search.placeholder")} />
                <p className="text-xs text-subtle-foreground mt-3">
                  {t("hero.keyboardHintPre")}{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border/50 font-mono text-[10px] text-muted-foreground">
                    /
                  </kbd>{" "}
                  {t("hero.keyboardHintPost")}
                </p>
              </div>
              <PlatformBadges className="mb-8 md:mb-12" selected={EMPTY_SET} onToggle={NOOP} />
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12" aria-labelledby="popular-title">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <h2 id="popular-title" className="text-2xl font-bold text-foreground">
                {t("popular.title")}
              </h2>
            </div>
            <LoadingSkeleton count={12} />
          </div>
        </section>
      </main>
    </div>
  )
}
