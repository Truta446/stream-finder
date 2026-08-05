import type { MetadataRoute } from "next"
import { routing } from "@/i18n/routing"
import { buildTitleUrl } from "@/lib/utils/slug"
import { posts } from "@/lib/blog"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://reelhuntr.com"
const TMDB_BASE = "https://api.themoviedb.org/3"

export const revalidate = 86400

function authHeaders(): HeadersInit {
  const token = process.env.TMDB_READ_TOKEN
  if (token) return { Authorization: `Bearer ${token}`, Accept: "application/json" }
  return { Accept: "application/json" }
}

interface TmdbItem {
  id: number
  title?: string
  name?: string
  media_type?: "movie" | "tv"
  poster_path?: string | null
}

async function fetchTrendingPage(page: number): Promise<TmdbItem[]> {
  try {
    const url = new URL(`${TMDB_BASE}/trending/all/week`)
    url.searchParams.set("language", "en-US")
    url.searchParams.set("page", String(page))
    if (process.env.TMDB_API_KEY && !process.env.TMDB_READ_TOKEN) {
      url.searchParams.set("api_key", process.env.TMDB_API_KEY)
    }
    const res = await fetch(url.toString(), { headers: authHeaders(), next: { revalidate: 86400 } })
    if (!res.ok) return []
    const data = await res.json() as { results: TmdbItem[] }
    return data.results.filter(
      (r) => (r.media_type === "movie" || r.media_type === "tv") && r.poster_path,
    )
  } catch {
    return []
  }
}

function titleLocaleUrl(locale: string, type: "movie" | "tv", name: string, id: number): string {
  const tmdbId = `tmdb:${type}:${id}`
  const path = buildTitleUrl(locale, type, name, tmdbId)
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = routing.locales.flatMap((locale) => {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`
    return [
      {
        url: locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`,
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: locale === routing.defaultLocale ? 1 : 0.9,
      },
      {
        url: `${SITE_URL}${prefix}/privacy-policy`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.3,
      },
      {
        url: `${SITE_URL}${prefix}/terms`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.3,
      },
      {
        url: `${SITE_URL}${prefix}/contact`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.4,
      },
      {
        url: `${SITE_URL}${prefix}/about`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      },
      {
        url: `${SITE_URL}${prefix}/blog`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      ...posts.map((post) => ({
        url: `${SITE_URL}${prefix}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ]
  })

  // Fetch 5 pages of trending (≈ 100 titles, with deduplication ~80 unique)
  const pages = await Promise.all([1, 2, 3, 4, 5].map(fetchTrendingPage))
  const seen = new Set<string>()
  const titleEntries: MetadataRoute.Sitemap = []

  for (const items of pages) {
    for (const item of items) {
      const type = item.media_type as "movie" | "tv"
      const name = item.title ?? item.name ?? ""
      if (!name) continue
      const key = `${type}:${item.id}`
      if (seen.has(key)) continue
      seen.add(key)

      for (const locale of routing.locales) {
        titleEntries.push({
          url: titleLocaleUrl(locale, type, name, item.id),
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: locale === routing.defaultLocale ? 0.8 : 0.7,
        })
      }
    }
  }

  return [...staticPages, ...titleEntries]
}
