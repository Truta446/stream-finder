/**
 * Converts arbitrary text to a URL-safe slug.
 * Strips diacritics, punctuation, and compresses whitespace to hyphens.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .slice(0, 60)
    .replace(/-$/, "")
}

/**
 * Builds the full path for a title's dedicated page.
 * English (default locale) has no prefix: /movie/inception-27205
 * Other locales:  /es/movie/inception-27205  /pt-BR/tv/berlin-308014
 */
export function buildTitleUrl(
  locale: string,
  type: "movie" | "tv",
  titleText: string,
  id: string, // "tmdb:tv:308014" or "tmdb:movie:27205"
): string {
  const numId = id.split(":").at(-1) ?? id
  const slug = `${slugify(titleText)}-${numId}`
  const prefix = locale === "en" ? "" : `/${locale}`
  return `${prefix}/${type}/${slug}`
}

/**
 * Extracts the TMDB composite ID from a slug.
 * "berlin-and-the-lady-308014" + type "tv" → "tmdb:tv:308014"
 */
export function parseSlugId(slug: string, type: string): string | null {
  const match = slug.match(/-(\d+)$/)
  if (!match) return null
  return `tmdb:${type}:${match[1]}`
}
