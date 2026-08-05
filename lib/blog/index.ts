import type { BlogPost, BlogPostTranslation, Locale } from "./types"
import { DEFAULT_AUTHOR } from "./types"
import { curatedPosts } from "./posts-curated"
import { guidePosts } from "./posts-guides"

export type { BlogPost, BlogPostTranslation, Locale, BlogAuthor } from "./types"
export { DEFAULT_AUTHOR } from "./types"

/** All posts, newest first. */
export const posts: BlogPost[] = [...guidePosts, ...curatedPosts].sort((a, b) =>
  b.date.localeCompare(a.date),
)

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getTranslation(post: BlogPost, locale: string): BlogPostTranslation {
  return post.translations[locale as Locale] ?? post.translations.en
}

export function getAuthor(post: BlogPost) {
  return post.author ?? DEFAULT_AUTHOR
}

export function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(
    locale === "pt-BR" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  )
}
