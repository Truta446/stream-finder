import "server-only"
import type { Title } from "./types"
import {
  tmdbAvailable,
  tmdbSearch,
  tmdbTrending,
  tmdbDetails,
  tmdbDiscoverByProviders,
  parseTmdbId,
} from "./tmdb"
import { omdbAvailable, omdbSearch, omdbDetails, parseOmdbId } from "./omdb"
import { mockSearch, mockPopular, mockDetails } from "./mock"

/**
 * Priority order (any failure → next):
 *   1. TMDB (best metadata + JustWatch-backed `watch/providers`)
 *   2. OMDb (metadata-only fallback when TMDB is down/unauthorized)
 *   3. Local mock (so the UI never breaks on demos / offline)
 */

type Stage = "tmdb" | "omdb" | "mock"

export interface AggregatedResponse<T> {
  data: T
  source: Stage
  triedSources: Array<{ source: Stage; ok: boolean; error?: string }>
  page?: number
  hasMore?: boolean
}

export interface FilterOptions {
  region: string
  providerIds: number[]
  page?: number
}

async function attempt<T>(
  stage: Stage,
  enabled: boolean,
  fn: () => Promise<T>,
  isEmpty: (v: T) => boolean,
  triedSources: AggregatedResponse<T>["triedSources"],
): Promise<T | null> {
  if (!enabled) {
    triedSources.push({ source: stage, ok: false, error: "disabled (missing key)" })
    return null
  }
  try {
    const v = await fn()
    if (isEmpty(v)) {
      triedSources.push({ source: stage, ok: false, error: "empty result" })
      return null
    }
    triedSources.push({ source: stage, ok: true })
    return v
  } catch (e) {
    triedSources.push({
      source: stage,
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    })
    return null
  }
}

/**
 * Enrich a list of search results with their watch providers, then keep only
 * those available on one of the selected provider ids in the given region.
 * Used only when a provider filter is active — costs one detail call per result
 * (parallel, cached via Next's `revalidate`).
 */
async function filterByProviders(
  results: Title[],
  region: string,
  providerIds: number[],
  limit = 20,
): Promise<Title[]> {
  if (providerIds.length === 0) return results
  const targetSet = new Set(providerIds.map(String))
  const subset = results.slice(0, limit)

  const enriched = await Promise.allSettled(
    subset.map((t) => {
      const parsed = parseTmdbId(t.id)
      if (!parsed) return Promise.resolve(t)
      return tmdbDetails(parsed.type, parsed.tmdbId).then((full) => full ?? t)
    }),
  )

  return enriched
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter((t): t is Title => {
      if (!t) return false
      const provs = t.providers[region] ?? []
      return provs.some((p) => targetSet.has(p.id))
    })
}

export async function searchAll(
  rawQuery: string,
  filter?: FilterOptions,
): Promise<AggregatedResponse<Title[]>> {
  const query = rawQuery.trim().slice(0, 100)
  const tried: AggregatedResponse<Title[]>["triedSources"] = []
  if (!query) return { data: [], source: "mock", triedSources: tried }

  const tmdb = await attempt<Title[]>(
    "tmdb",
    tmdbAvailable(),
    () => tmdbSearch(query),
    (v) => v.length === 0,
    tried,
  )
  if (tmdb) {
    const filtered = filter && filter.providerIds.length > 0
      ? await filterByProviders(tmdb, filter.region, filter.providerIds)
      : tmdb
    return { data: filtered, source: "tmdb", triedSources: tried }
  }

  const omdb = await attempt<Title[]>(
    "omdb",
    omdbAvailable(),
    () => omdbSearch(query),
    (v) => v.length === 0,
    tried,
  )
  if (omdb) return { data: omdb, source: "omdb", triedSources: tried }

  return { data: mockSearch(query), source: "mock", triedSources: tried }
}

export async function popularAll(
  filter?: FilterOptions,
): Promise<AggregatedResponse<Title[]>> {
  const tried: AggregatedResponse<Title[]>["triedSources"] = []
  const page = Math.max(1, Math.min(50, filter?.page ?? 1))

  if (filter && filter.providerIds.length > 0) {
    const discover = await attempt(
      "tmdb",
      tmdbAvailable(),
      () => tmdbDiscoverByProviders(filter.region, filter.providerIds, page),
      (v) => v.titles.length === 0,
      tried,
    )
    if (discover) {
      return {
        data: discover.titles,
        source: "tmdb",
        triedSources: tried,
        page: discover.page,
        hasMore: discover.hasMore,
      }
    }
  }

  const tmdb = await attempt(
    "tmdb",
    tmdbAvailable(),
    () => tmdbTrending(page),
    (v) => v.titles.length === 0,
    tried,
  )
  if (tmdb) {
    return {
      data: tmdb.titles,
      source: "tmdb",
      triedSources: tried,
      page: tmdb.page,
      hasMore: tmdb.hasMore,
    }
  }
  return { data: mockPopular(), source: "mock", triedSources: tried, page: 1, hasMore: false }
}

export async function detailsAll(id: string): Promise<AggregatedResponse<Title | null>> {
  const tried: AggregatedResponse<Title | null>["triedSources"] = []

  const tmdbInfo = parseTmdbId(id)
  if (tmdbInfo) {
    const t = await attempt<Title | null>(
      "tmdb",
      tmdbAvailable(),
      () => tmdbDetails(tmdbInfo.type, tmdbInfo.tmdbId),
      (v) => v === null,
      tried,
    )
    if (t) return { data: t, source: "tmdb", triedSources: tried }
  }

  const imdb = parseOmdbId(id)
  if (imdb) {
    const t = await attempt<Title | null>(
      "omdb",
      omdbAvailable(),
      () => omdbDetails(imdb),
      (v) => v === null,
      tried,
    )
    if (t) return { data: t, source: "omdb", triedSources: tried }
  }

  return { data: mockDetails(id), source: "mock", triedSources: tried }
}
