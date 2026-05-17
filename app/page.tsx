"use client"

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Play, X } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { SearchBar } from "@/components/stream-finder/search-bar"
import { RegionSelector } from "@/components/stream-finder/region-selector"
import { MovieCard } from "@/components/stream-finder/movie-card"
import { TitleDetails } from "@/components/stream-finder/title-details"
import { LoadingSkeleton } from "@/components/stream-finder/loading-skeleton"
import { EmptyState } from "@/components/stream-finder/empty-state"
import { PlatformBadges } from "@/components/stream-finder/platform-badges"
import { TypeToggle, type MediaType } from "@/components/stream-finder/type-toggle"
import { SortMenu, type SortKey } from "@/components/stream-finder/sort-menu"
import { useDebouncedValue } from "@/hooks/use-debounce"
import { useRegion } from "@/hooks/use-region"
import { MIN_QUERY_LENGTH, usePopularTitles, useSearchTitles, useTitleDetails } from "@/hooks/use-titles"
import { useUrlState } from "@/hooks/use-url-state"
import { titleDetailsApi } from "@/lib/api/client"
import { POPULAR_PLATFORMS, isSupportedRegion, resolveTmdbProviderIds, type Title } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { AdUnit } from "@/components/ui/ad-unit"
import { toast } from "sonner"

function StreamFinderInner() {
  const url = useUrlState()
  const queryClient = useQueryClient()

  // SearchQuery is local state so typing stays buttery; we mirror TO the URL.
  const [searchQuery, setSearchQueryState] = useState(url.q)
  useEffect(() => {
    if (url.q !== searchQuery) setSearchQueryState(url.q)
    // intentionally not depending on searchQuery: only sync when URL changes externally (popstate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url.q])

  const [storedRegion, persistRegion] = useRegion()
  const region = url.region && isSupportedRegion(url.region) ? url.region : storedRegion
  const setRegion = useCallback(
    (code: string) => {
      persistRegion(code)
      url.write({ region: code })
    },
    [persistRegion, url],
  )

  const selectedPlatforms = useMemo(() => new Set(url.p), [url.p])
  const togglePlatform = useCallback(
    (id: string) => {
      const next = new Set(url.p)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      url.write({ p: [...next] })
    },
    [url],
  )
  const clearPlatforms = useCallback(() => url.write({ p: [] }), [url])

  const mediaType: MediaType = url.type
  const setMediaType = useCallback((t: MediaType) => url.write({ type: t }), [url])

  const sort: SortKey = (["popularity", "rating", "year", "title"] as const).includes(
    url.sort as SortKey,
  )
    ? (url.sort as SortKey)
    : "popularity"
  const setSort = useCallback((s: SortKey) => url.write({ sort: s }), [url])

  const selectedTitleId = url.id
  const setSelectedTitleId = useCallback(
    (id: string | null) => url.write({ id }, true /* push for back button */),
    [url],
  )

  const providerIds = useMemo(
    () => resolveTmdbProviderIds([...selectedPlatforms]),
    [selectedPlatforms],
  )
  const filterArgs = useMemo(() => ({ region, providerIds }), [region, providerIds])

  const headerInputRef = useRef<HTMLInputElement>(null)
  const heroInputRef = useRef<HTMLInputElement>(null)
  const pendingFocusRef = useRef<"header" | "hero" | null>(null)

  const debouncedQuery = useDebouncedValue(searchQuery, 800)
  const trimmed = debouncedQuery.trim()
  const rawTrimmed = searchQuery.trim()
  const isQueryLongEnough = rawTrimmed.length >= MIN_QUERY_LENGTH
  const hasSearched = trimmed.length >= MIN_QUERY_LENGTH

  const searchQ = useSearchTitles(debouncedQuery, filterArgs)
  const popularQ = usePopularTitles(filterArgs)

  // Surface API errors as a toast (one per error transition)
  const lastErrorRef = useRef<{ search?: string; popular?: string }>({})
  useEffect(() => {
    const msg = searchQ.error instanceof Error ? searchQ.error.message : ""
    if (msg && msg !== lastErrorRef.current.search) {
      lastErrorRef.current.search = msg
      toast.error("Search failed", {
        description: msg,
        action: { label: "Retry", onClick: () => void searchQ.refetch() },
      })
    } else if (!msg) {
      lastErrorRef.current.search = undefined
    }
  }, [searchQ.error, searchQ])

  useEffect(() => {
    const msg = popularQ.error instanceof Error ? popularQ.error.message : ""
    if (msg && msg !== lastErrorRef.current.popular) {
      lastErrorRef.current.popular = msg
      toast.error("Couldn’t load popular titles", {
        description: msg,
        action: { label: "Retry", onClick: () => void popularQ.refetch() },
      })
    } else if (!msg) {
      lastErrorRef.current.popular = undefined
    }
  }, [popularQ.error, popularQ])

  const rawResults = searchQ.data?.data ?? []
  /**
   * TMDB /trending and /discover can repeat the same title across pages (popularity
   * scores shift while we paginate). Dedupe by id so React keys stay unique and the
   * user doesn't see the same poster twice.
   */
  const rawPopular = useMemo(() => {
    const out: Title[] = []
    const seen = new Set<string>()
    for (const page of popularQ.data?.pages ?? []) {
      for (const t of page.data) {
        if (seen.has(t.id)) continue
        seen.add(t.id)
        out.push(t)
      }
    }
    return out
  }, [popularQ.data])
  const popularSource = popularQ.data?.pages[0]?.source

  /** Apply client-side media type filter + sort to a list of titles. */
  const refine = useCallback(
    (items: Title[]) => {
      let out = mediaType === "all" ? items : items.filter((t) => t.type === mediaType)
      switch (sort) {
        case "rating":
          out = [...out].sort((a, b) => b.rating - a.rating)
          break
        case "year":
          out = [...out].sort((a, b) => (b.year || 0) - (a.year || 0))
          break
        case "title":
          out = [...out].sort((a, b) => a.title.localeCompare(b.title))
          break
        case "popularity":
        default:
          // server already returns by popularity, no-op
          break
      }
      return out
    },
    [mediaType, sort],
  )

  const results = useMemo(() => refine(rawResults), [refine, rawResults])
  const popular = useMemo(() => refine(rawPopular), [refine, rawPopular])

  const debouncePending = rawTrimmed !== trimmed
  const isSearching =
    (isQueryLongEnough && debouncePending) ||
    (hasSearched && (searchQ.isPending || searchQ.isFetching))
  const showResults = rawTrimmed.length > 0

  /** Hero ↔ header SearchBar focus carry-over (see hero/header swap below). */
  const handleSearchChange = (value: string, source: "hero" | "header") => {
    if (source === "hero" && value.trim().length > 0 && !showResults) {
      pendingFocusRef.current = "header"
    } else if (source === "header" && value.trim().length === 0 && showResults) {
      pendingFocusRef.current = "hero"
    }
    setSearchQueryState(value)
    url.write({ q: value })
  }

  useEffect(() => {
    const target = pendingFocusRef.current
    if (!target) return
    pendingFocusRef.current = null
    const el = target === "header" ? headerInputRef.current : heroInputRef.current
    if (!el) return
    el.focus({ preventScroll: true })
    const len = el.value.length
    try {
      el.setSelectionRange(len, len)
    } catch {
      /* type="search" disallows selection range in some browsers */
    }
  }, [showResults])

  /** Global shortcuts:  /  focuses search;  Esc  inside search clears it. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const t = e.target as HTMLElement | null
        const tag = t?.tagName?.toLowerCase()
        if (tag === "input" || tag === "textarea" || (t && t.isContentEditable)) return
        e.preventDefault()
        const el = headerInputRef.current ?? heroInputRef.current
        el?.focus({ preventScroll: true })
      } else if (e.key === "Escape") {
        const active = document.activeElement as HTMLElement | null
        if (active === headerInputRef.current || active === heroInputRef.current) {
          if (searchQuery.length > 0) {
            e.preventDefault()
            setSearchQueryState("")
            url.write({ q: "" })
          }
        }
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [searchQuery, url])

  const detailsQ = useTitleDetails(selectedTitleId)

  const previewTitle = useMemo<Title | null>(() => {
    if (!selectedTitleId) return null
    return (
      results.find((t) => t.id === selectedTitleId) ??
      popular.find((t) => t.id === selectedTitleId) ??
      null
    )
  }, [selectedTitleId, results, popular])

  const selectedTitle: Title | null = detailsQ.data?.data ?? previewTitle

  /** Prefetch full details when the user hovers a card — modal then opens instantly. */
  const prefetchTitle = useCallback(
    (id: string) => {
      queryClient.prefetchQuery({
        queryKey: ["title", id],
        queryFn: ({ signal }) => titleDetailsApi(id, signal),
        staleTime: 1000 * 60 * 30,
      })
    },
    [queryClient],
  )

  const platformsLabel = useMemo(
    () =>
      [...selectedPlatforms]
        .map((id) => POPULAR_PLATFORMS.find((p) => p.id === id)?.name)
        .filter(Boolean)
        .join(", "),
    [selectedPlatforms],
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
          <a href="/" className="flex items-center gap-2 shrink-0" aria-label="StreamFinder home">
            <div className="bg-primary rounded-lg p-1.5">
              <Play className="h-5 w-5 text-primary-foreground fill-primary-foreground" aria-hidden />
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:inline">StreamFinder</span>
          </a>

          {showResults && (
            <div className="flex-1 max-w-xl mx-1 sm:mx-4 min-w-0">
              <SearchBar
                value={searchQuery}
                onChange={(v) => handleSearchChange(v, "header")}
                size="default"
                inputRef={headerInputRef}
              />
            </div>
          )}

          <RegionSelector value={region} onChange={setRegion} />
        </div>
      </header>

      <main className="flex-1">
        {!showResults && (
          <>
            <section className="relative py-12 sm:py-20 md:py-28" aria-labelledby="hero-title">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center">
                  <h1
                    id="hero-title"
                    className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance mb-4 md:mb-6"
                  >
                    Find where to watch any movie or show
                  </h1>
                  <p className="text-base sm:text-xl text-muted-foreground mb-8 md:mb-10 text-pretty">
                    Search across streaming platforms and discover where your favorite titles are
                    available.
                  </p>
                  <div className="max-w-2xl mx-auto mb-8">
                    <SearchBar
                      value={searchQuery}
                      onChange={(v) => handleSearchChange(v, "hero")}
                      size="large"
                      placeholder="Search for movies or TV shows..."
                      inputRef={heroInputRef}
                    />
                    <p className="text-xs text-muted-foreground/70 mt-3">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-secondary border border-border/50 font-mono text-[10px]">/</kbd>{" "}
                      anytime to focus the search
                    </p>
                  </div>
                  <PlatformBadges
                    className="mb-8 md:mb-12"
                    selected={selectedPlatforms}
                    onToggle={togglePlatform}
                  />
                </div>
              </div>
            </section>

            <section className="py-8 md:py-12" aria-labelledby="popular-title">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                  <h2 id="popular-title" className="text-2xl font-bold text-foreground">
                    {selectedPlatforms.size > 0 ? `Popular on ${platformsLabel}` : "Popular titles"}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <TypeToggle value={mediaType} onChange={setMediaType} />
                    <SortMenu value={sort} onChange={setSort} />
                    {selectedPlatforms.size > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearPlatforms}
                        className="text-muted-foreground hover:text-foreground gap-1.5"
                      >
                        <X className="h-3.5 w-3.5" />
                        Clear filter
                      </Button>
                    )}
                  </div>
                </div>
                {popularQ.isPending ? (
                  <LoadingSkeleton count={12} />
                ) : popular.length === 0 ? (
                  <EmptyState type="no-results" />
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                      {popular.flatMap((title, i) => {
                        const card = (
                          <MovieCard
                            key={title.id}
                            title={title}
                            priority={i < 5}
                            onClick={() => setSelectedTitleId(title.id)}
                            onHover={() => prefetchTitle(title.id)}
                          />
                        )
                        if (i === 10) {
                          return [
                            <div key="ad-popular" className="col-span-full py-1">
                              <AdUnit
                                slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_POPULAR ?? ""}
                                format="horizontal"
                              />
                            </div>,
                            card,
                          ]
                        }
                        return [card]
                      })}
                    </div>
                    <div className="flex flex-col items-center gap-2 mt-8">
                      {popularQ.hasNextPage ? (
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => popularQ.fetchNextPage()}
                          disabled={popularQ.isFetchingNextPage}
                          className="min-w-40"
                        >
                          {popularQ.isFetchingNextPage ? "Loading..." : "Load more"}
                        </Button>
                      ) : (
                        <p className="text-xs text-muted-foreground/60">
                          End of results
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground/60">
                        Showing {popular.length} title{popular.length !== 1 ? "s" : ""}
                        {popularSource && (
                          <span className="ml-2 uppercase tracking-wider">via {popularSource}</span>
                        )}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </section>
          </>
        )}

        {showResults && (
          <section className="py-8" aria-labelledby="results-title">
            <div className="container mx-auto px-4">
              <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 id="results-title" className="text-xl font-semibold text-foreground">
                    {!isQueryLongEnough
                      ? "Keep typing..."
                      : isSearching
                        ? "Searching..."
                        : `Results for "${trimmed || rawTrimmed}"`}
                  </h2>
                  {!isQueryLongEnough && (
                    <p className="text-muted-foreground text-sm mt-1">
                      Type at least {MIN_QUERY_LENGTH} characters to search.
                    </p>
                  )}
                  {isQueryLongEnough && !isSearching && results.length > 0 && (
                    <p className="text-muted-foreground text-sm mt-1">
                      {results.length} title{results.length !== 1 ? "s" : ""} found
                      {selectedPlatforms.size > 0 && (
                        <span className="ml-2">on {platformsLabel}</span>
                      )}
                      {searchQ.data?.source && (
                        <span className="ml-2 text-xs uppercase tracking-wider opacity-70">
                          via {searchQ.data.source}
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <TypeToggle value={mediaType} onChange={setMediaType} />
                  <SortMenu value={sort} onChange={setSort} />
                  {selectedPlatforms.size > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearPlatforms}
                      className="text-muted-foreground hover:text-foreground gap-1.5"
                    >
                      <X className="h-3.5 w-3.5" />
                      Clear filter
                    </Button>
                  )}
                </div>
              </div>

              {!isQueryLongEnough ? null : isSearching ? (
                <LoadingSkeleton count={6} />
              ) : searchQ.isError ? (
                <EmptyState type="no-results" query={searchQuery} />
              ) : results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {results.map((title, i) => (
                    <MovieCard
                      key={title.id}
                      title={title}
                      priority={i < 5}
                      onClick={() => setSelectedTitleId(title.id)}
                      onHover={() => prefetchTitle(title.id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState type="no-results" query={searchQuery} />
              )}
            </div>
          </section>
        )}
      </main>

      <AdUnit
        slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER ?? ""}
        format="horizontal"
        className="container mx-auto px-4 py-4"
      />

      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            StreamFinder helps you find where to stream movies and TV shows.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            Data from TMDB, JustWatch and OMDb. This product uses these APIs but is not endorsed
            or certified by them.
          </p>
        </div>
      </footer>

      {selectedTitle && (
        <TitleDetails
          title={selectedTitle}
          region={region}
          isLoading={detailsQ.isFetching && !detailsQ.data}
          onClose={() => setSelectedTitleId(null)}
        />
      )}
    </div>
  )
}

export default function StreamFinderPage() {
  return (
    <Suspense fallback={null}>
      <StreamFinderInner />
    </Suspense>
  )
}
