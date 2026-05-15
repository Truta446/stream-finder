import "server-only"
import type { ProviderType, StreamingProvider, Title } from "./types"
import { REGIONS } from "./types"
import { providerDeepLink } from "./provider-links"

const TMDB_BASE = "https://api.themoviedb.org/3"
const TMDB_IMG = "https://image.tmdb.org/t/p"

export function tmdbAvailable() {
  return !!(process.env.TMDB_API_KEY || process.env.TMDB_READ_TOKEN)
}

function authHeaders(): HeadersInit {
  const token = process.env.TMDB_READ_TOKEN
  if (token) return { Authorization: `Bearer ${token}`, Accept: "application/json" }
  return { Accept: "application/json" }
}

function withKey(url: URL) {
  const apiKey = process.env.TMDB_API_KEY
  if (apiKey && !process.env.TMDB_READ_TOKEN) url.searchParams.set("api_key", apiKey)
  return url
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}, revalidate = 3600): Promise<T> {
  const url = new URL(`${TMDB_BASE}${path}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  withKey(url)
  const res = await fetch(url.toString(), {
    headers: authHeaders(),
    next: { revalidate },
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`TMDB ${res.status} ${res.statusText} at ${path}`)
  return (await res.json()) as T
}

type TmdbSearchItem = {
  id: number
  media_type?: "movie" | "tv"
  title?: string
  name?: string
  original_title?: string
  original_name?: string
  release_date?: string
  first_air_date?: string
  poster_path?: string | null
  backdrop_path?: string | null
  overview?: string
  vote_average?: number
  vote_count?: number
  popularity?: number
  genre_ids?: number[]
}

type TmdbVideo = {
  key: string
  site: string
  type: string
  official?: boolean
  published_at?: string
}

type TmdbDetails = TmdbSearchItem & {
  genres?: Array<{ id: number; name: string }>
  runtime?: number
  number_of_seasons?: number
  episode_run_time?: number[]
  "watch/providers"?: { results: Record<string, TmdbProviderRegion> }
  videos?: { results: TmdbVideo[] }
}

type TmdbProviderEntry = { provider_id: number; provider_name: string; logo_path: string }
type TmdbProviderRegion = {
  link?: string
  flatrate?: TmdbProviderEntry[]
  rent?: TmdbProviderEntry[]
  buy?: TmdbProviderEntry[]
  ads?: TmdbProviderEntry[]
  free?: TmdbProviderEntry[]
}

function img(path: string | null | undefined, size: "w500" | "original" = "w500") {
  return path ? `${TMDB_IMG}/${size}${path}` : "/placeholder.jpg"
}

function toTitleFromSearch(item: TmdbSearchItem, fallbackType: "movie" | "tv"): Title | null {
  const type = (item.media_type ?? fallbackType) as "movie" | "tv"
  if (type !== "movie" && type !== "tv") return null
  const titleText = item.title || item.name || item.original_title || item.original_name || ""
  if (!titleText) return null
  const date = item.release_date || item.first_air_date || ""
  const year = date ? Number(date.slice(0, 4)) : 0
  return {
    id: `tmdb:${type}:${item.id}`,
    title: titleText,
    year: Number.isFinite(year) ? year : 0,
    type,
    poster: img(item.poster_path),
    backdrop: img(item.backdrop_path, "original"),
    description: item.overview ?? "",
    rating: typeof item.vote_average === "number" ? Number(item.vote_average.toFixed(1)) : 0,
    genres: [],
    providers: {},
    source: "tmdb",
  }
}

function mapProviderType(bucket: keyof TmdbProviderRegion): ProviderType | null {
  switch (bucket) {
    case "flatrate":
      return "subscription"
    case "rent":
      return "rent"
    case "buy":
      return "buy"
    case "ads":
    case "free":
      return "free"
    default:
      return null
  }
}

function flattenProviders(
  perRegion: Record<string, TmdbProviderRegion> | undefined,
  titleText: string,
): Title["providers"] {
  if (!perRegion) return {}
  const out: Title["providers"] = {}
  const buckets: Array<keyof TmdbProviderRegion> = ["flatrate", "rent", "buy", "ads", "free"]
  for (const region of REGIONS.map((r) => r.code)) {
    const entry = perRegion[region]
    if (!entry) continue
    const list: StreamingProvider[] = []
    const seen = new Set<string>()
    for (const b of buckets) {
      const type = mapProviderType(b)
      if (!type) continue
      const items = (entry[b] as TmdbProviderEntry[] | undefined) ?? []
      for (const p of items) {
        const key = `${p.provider_id}:${type}`
        if (seen.has(key)) continue
        seen.add(key)
        list.push({
          id: String(p.provider_id),
          name: p.provider_name,
          logo: img(p.logo_path),
          type,
          url: providerDeepLink(p.provider_name, titleText, region, entry.link || "#"),
        })
      }
    }
    if (list.length) out[region] = list
  }
  return out
}

export async function tmdbSearch(query: string): Promise<Title[]> {
  const data = await tmdbFetch<{ results: TmdbSearchItem[] }>("/search/multi", {
    query,
    include_adult: "false",
    language: "en-US",
  })

  // TMDB returns up to 20 results per page already sorted by their own relevance.
  // Their default heuristic mixes name match + popularity, but it sometimes ranks
  // an obscure title above the obvious one. Re-score so the obviously popular
  // match wins: titles with a poster, ≥5 votes, and notable popularity rise first.
  const scored = data.results
    .filter((r) => r.media_type === "movie" || r.media_type === "tv")
    .filter((r) => !!r.poster_path)
    .map((r) => {
      const pop = r.popularity ?? 0
      const votes = r.vote_count ?? 0
      const score = pop * Math.log10(votes + 10)
      return { r, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)

  return scored
    .map(({ r }) => toTitleFromSearch(r, r.media_type as "movie" | "tv"))
    .filter((t): t is Title => !!t)
}

export interface Paginated {
  titles: Title[]
  page: number
  hasMore: boolean
}

export async function tmdbTrending(page = 1): Promise<Paginated> {
  const data = await tmdbFetch<{
    results: TmdbSearchItem[]
    page: number
    total_pages: number
  }>("/trending/all/week", {
    language: "en-US",
    page: String(page),
  })
  const titles = data.results
    .filter((r) => r.media_type === "movie" || r.media_type === "tv")
    .filter((r) => !!r.poster_path)
    .map((r) => toTitleFromSearch(r, r.media_type as "movie" | "tv"))
    .filter((t): t is Title => !!t)
  return { titles, page: data.page, hasMore: data.page < data.total_pages }
}

/**
 * Discover popular titles filtered by streaming provider availability in a region.
 * Calls /discover/movie and /discover/tv in parallel and interleaves the results.
 *
 * `providerIds` are TMDB provider ids; multiple ids are joined with `|` (OR).
 */
export async function tmdbDiscoverByProviders(
  region: string,
  providerIds: number[],
  page = 1,
): Promise<Paginated> {
  if (providerIds.length === 0) return { titles: [], page: 1, hasMore: false }
  const providers = providerIds.join("|")
  const common = {
    language: "en-US",
    sort_by: "popularity.desc",
    watch_region: region,
    with_watch_providers: providers,
    with_watch_monetization_types: "flatrate|free|ads",
    include_adult: "false",
    page: String(page),
  }
  const [movies, tv] = await Promise.all([
    tmdbFetch<{ results: TmdbSearchItem[]; page: number; total_pages: number }>(
      "/discover/movie",
      common,
      1800,
    ),
    tmdbFetch<{ results: TmdbSearchItem[]; page: number; total_pages: number }>(
      "/discover/tv",
      common,
      1800,
    ),
  ])
  const interleaved: TmdbSearchItem[] = []
  const max = Math.max(movies.results.length, tv.results.length)
  for (let i = 0; i < max; i++) {
    if (movies.results[i]) interleaved.push({ ...movies.results[i], media_type: "movie" })
    if (tv.results[i]) interleaved.push({ ...tv.results[i], media_type: "tv" })
  }
  const titles = interleaved
    .filter((r) => !!r.poster_path)
    .map((r) => toTitleFromSearch(r, r.media_type as "movie" | "tv"))
    .filter((t): t is Title => !!t)
  const totalPages = Math.max(movies.total_pages ?? 1, tv.total_pages ?? 1)
  return { titles, page, hasMore: page < totalPages }
}

function pickTrailerKey(videos: TmdbVideo[] | undefined): string | undefined {
  if (!videos || videos.length === 0) return undefined
  const youtube = videos.filter((v) => v.site === "YouTube")
  if (youtube.length === 0) return undefined
  // Prefer official Trailer, then any Trailer, then Teaser, then Clip.
  const rank = (v: TmdbVideo) => {
    const base = v.type === "Trailer" ? 3 : v.type === "Teaser" ? 2 : v.type === "Clip" ? 1 : 0
    return base + (v.official ? 0.5 : 0)
  }
  return [...youtube].sort((a, b) => rank(b) - rank(a))[0]?.key
}

export async function tmdbDetails(type: "movie" | "tv", id: string | number): Promise<Title | null> {
  const data = await tmdbFetch<TmdbDetails>(`/${type}/${id}`, {
    append_to_response: "watch/providers,videos",
    language: "en-US",
  })
  const base = toTitleFromSearch(data, type)
  if (!base) return null
  base.genres = (data.genres ?? []).map((g) => g.name)
  if (type === "movie" && data.runtime) {
    const h = Math.floor(data.runtime / 60)
    const m = data.runtime % 60
    base.runtime = h > 0 ? `${h}h ${m}min` : `${m}min`
  }
  if (type === "tv") {
    base.seasons = data.number_of_seasons ?? undefined
  }
  base.providers = flattenProviders(data["watch/providers"]?.results, base.title)
  base.trailerKey = pickTrailerKey(data.videos?.results)
  return base
}

export function parseTmdbId(id: string): { type: "movie" | "tv"; tmdbId: string } | null {
  const m = /^tmdb:(movie|tv):(\d+)$/.exec(id)
  if (!m) return null
  return { type: m[1] as "movie" | "tv", tmdbId: m[2] }
}
