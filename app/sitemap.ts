import type { MetadataRoute } from "next"
import { routing } from "@/i18n/routing"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://stream-finder-navy.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return routing.locales.map((locale) => ({
    url: locale === routing.defaultLocale ? SITE_URL : `${SITE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: locale === routing.defaultLocale ? 1 : 0.9,
  }))
}
