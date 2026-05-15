export type ProviderType = "subscription" | "rent" | "buy" | "free"

export interface StreamingProvider {
  id: string
  name: string
  logo: string
  type: ProviderType
  url: string
}

export interface Title {
  id: string
  title: string
  year: number
  type: "movie" | "tv"
  poster: string
  backdrop: string
  description: string
  rating: number
  genres: string[]
  runtime?: string
  seasons?: number
  providers: Record<string, StreamingProvider[]>
  /** YouTube video id for a trailer (TMDB videos endpoint). */
  trailerKey?: string
  /** which data source produced this record (debug + UI badge) */
  source?: "tmdb" | "omdb" | "mock"
}

export interface DataSourceResult<T> {
  data: T | null
  source: "tmdb" | "omdb" | "mock" | null
  errors: Array<{ source: string; message: string }>
}

export const REGIONS = [
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
] as const

export type RegionCode = (typeof REGIONS)[number]["code"]

export const REGION_CODES: readonly string[] = REGIONS.map((r) => r.code)

export function isSupportedRegion(code: string): boolean {
  return REGION_CODES.includes(code.toUpperCase())
}

export const POPULAR_PLATFORMS = [
  {
    id: "netflix",
    name: "Netflix",
    logo: "https://images.justwatch.com/icon/207360008/s100/netflix.webp",
    tmdbProviderIds: [8],
  },
  {
    id: "prime",
    name: "Prime Video",
    logo: "https://images.justwatch.com/icon/52449861/s100/amazonprimevideo.webp",
    tmdbProviderIds: [119, 9],
  },
  {
    id: "disney",
    name: "Disney+",
    logo: "https://images.justwatch.com/icon/147638351/s100/disneyplus.webp",
    tmdbProviderIds: [337],
  },
  {
    id: "max",
    name: "Max",
    logo: "https://images.justwatch.com/icon/305458112/s100/max.webp",
    tmdbProviderIds: [1899, 384, 3],
  },
  {
    id: "apple",
    name: "Apple TV+",
    logo: "https://images.justwatch.com/icon/190848813/s100/apple-tv-plus.webp",
    tmdbProviderIds: [350, 2],
  },
  {
    id: "paramount",
    name: "Paramount+",
    logo: "/platforms/paramount.svg",
    tmdbProviderIds: [531, 1853],
  },
] as const

export type PlatformId = (typeof POPULAR_PLATFORMS)[number]["id"]

/** Resolve a list of platform-pill ids to the union of their TMDB provider ids. */
export function resolveTmdbProviderIds(platformIds: readonly string[]): number[] {
  const set = new Set<number>()
  for (const pid of platformIds) {
    const platform = POPULAR_PLATFORMS.find((p) => p.id === pid)
    if (!platform) continue
    for (const id of platform.tmdbProviderIds) set.add(id)
  }
  return [...set]
}
