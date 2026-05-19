import "server-only"
import type { Title } from "./types"

const OMDB_BASE = "https://www.omdbapi.com"

const ALLOWED_POSTER_HOSTS = new Set(["m.media-amazon.com", "media-amazon.com"])

function isSafePosterUrl(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url)
    return protocol === "https:" && ALLOWED_POSTER_HOSTS.has(hostname)
  } catch {
    return false
  }
}

export function omdbAvailable() {
  return !!process.env.OMDB_API_KEY
}

type OmdbSearchItem = {
  Title: string
  Year: string
  imdbID: string
  Type: "movie" | "series" | "episode"
  Poster: string
}

type OmdbSearchResponse = {
  Search?: OmdbSearchItem[]
  Response: "True" | "False"
  Error?: string
}

type OmdbDetail = {
  Title: string
  Year: string
  Rated?: string
  Runtime?: string
  Genre?: string
  Plot?: string
  Poster?: string
  imdbRating?: string
  imdbID: string
  Type: "movie" | "series" | "episode"
  totalSeasons?: string
  Response: "True" | "False"
  Error?: string
}

async function omdbFetch<T>(params: Record<string, string>): Promise<T> {
  const apiKey = process.env.OMDB_API_KEY
  if (!apiKey) throw new Error("OMDb 401: missing OMDB_API_KEY")
  const url = new URL(OMDB_BASE)
  url.searchParams.set("apikey", apiKey)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`OMDb ${res.status} ${res.statusText}`)
  return (await res.json()) as T
}

function mapType(t: OmdbDetail["Type"] | OmdbSearchItem["Type"]): "movie" | "tv" {
  return t === "series" ? "tv" : "movie"
}

function detailToTitle(d: OmdbDetail): Title {
  const year = Number(d.Year?.slice(0, 4) || 0)
  const rating = Number(d.imdbRating || 0)
  return {
    id: `omdb:${d.imdbID}`,
    title: d.Title,
    year: Number.isFinite(year) ? year : 0,
    type: mapType(d.Type),
    poster: d.Poster && d.Poster !== "N/A" && isSafePosterUrl(d.Poster) ? d.Poster : "/placeholder.jpg",
    backdrop: d.Poster && d.Poster !== "N/A" && isSafePosterUrl(d.Poster) ? d.Poster : "/placeholder.jpg",
    description: d.Plot && d.Plot !== "N/A" ? d.Plot : "",
    rating: Number.isFinite(rating) ? rating : 0,
    genres: (d.Genre || "").split(",").map((g) => g.trim()).filter(Boolean),
    runtime: d.Runtime && d.Runtime !== "N/A" ? d.Runtime : undefined,
    seasons: d.totalSeasons ? Number(d.totalSeasons) : undefined,
    providers: {},
    source: "omdb",
  }
}

export async function omdbSearch(query: string): Promise<Title[]> {
  const data = await omdbFetch<OmdbSearchResponse>({ s: query, type: "" })
  if (data.Response !== "True" || !data.Search) return []
  const top = data.Search.slice(0, 10)
  const detailed = await Promise.allSettled(
    top.map((s) => omdbFetch<OmdbDetail>({ i: s.imdbID, plot: "short" })),
  )
  return detailed
    .filter((r): r is PromiseFulfilledResult<OmdbDetail> => r.status === "fulfilled" && r.value.Response === "True")
    .map((r) => detailToTitle(r.value))
}

export async function omdbDetails(imdbId: string): Promise<Title | null> {
  const d = await omdbFetch<OmdbDetail>({ i: imdbId, plot: "full" })
  if (d.Response !== "True") return null
  return detailToTitle(d)
}

export function parseOmdbId(id: string): string | null {
  const m = /^omdb:(tt\d+)$/.exec(id)
  return m ? m[1] : null
}
