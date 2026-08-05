export type Locale = "en" | "es" | "pt-BR"

export type BlogPostTranslation = {
  title: string
  description: string
  html: string
}

export type BlogAuthor = {
  name: string
  /** short bio line shown under the byline */
  role: Record<Locale, string>
}

export type BlogPost = {
  slug: string
  date: string
  /** last substantive update; falls back to `date` when absent */
  updated?: string
  readTime: number
  category: string
  emoji: string
  author?: BlogAuthor
  translations: Record<Locale, BlogPostTranslation>
}

export const DEFAULT_AUTHOR: BlogAuthor = {
  name: "Juan Versolato",
  role: {
    en: "Creator of ReelHuntr",
    es: "Creador de ReelHuntr",
    "pt-BR": "Criador do ReelHuntr",
  },
}
