import type { Metadata } from "next"
import Link from "next/link"
import { routing } from "@/i18n/routing"
import { posts, getTranslation, formatDate } from "@/lib/blog"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://reelhuntr.com"

const META: Record<string, { title: string; description: string }> = {
  en: {
    title: "Blog · ReelHuntr",
    description: "Streaming guides, curated watchlists, and tips to help you find what to watch — across every platform.",
  },
  es: {
    title: "Blog · ReelHuntr",
    description: "Guías de streaming, listas de reproducción curadas y consejos para ayudarte a encontrar qué ver en cualquier plataforma.",
  },
  "pt-BR": {
    title: "Blog · ReelHuntr",
    description: "Guias de streaming, listas selecionadas e dicas para te ajudar a encontrar o que assistir em qualquer plataforma.",
  },
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const meta = META[locale] ?? META.en
  const canonical = locale === "en" ? "/blog" : `/${locale}/blog`
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical,
      languages: { en: "/blog", es: "/es/blog", "pt-BR": "/pt-BR/blog", "x-default": "/blog" },
    },
    openGraph: { type: "website", url: `${SITE_URL}${canonical}`, title: meta.title, description: meta.description },
  }
}

const HEADING: Record<string, string> = {
  en: "Streaming Guides & Watchlists",
  es: "Guías de Streaming y Listas",
  "pt-BR": "Guias de Streaming e Listas",
}

const SUBHEADING: Record<string, string> = {
  en: "Tips, curated picks, and everything you need to find something great to watch.",
  es: "Consejos, selecciones curadas y todo lo que necesitas para encontrar algo genial que ver.",
  "pt-BR": "Dicas, seleções curadas e tudo o que você precisa para encontrar algo ótimo para assistir.",
}

const READ_MORE: Record<string, string> = {
  en: "Read article",
  es: "Leer artículo",
  "pt-BR": "Ler artigo",
}

const READ_TIME_LABEL: Record<string, string> = {
  en: "min read",
  es: "min de lectura",
  "pt-BR": "min de leitura",
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const prefix = locale === "en" ? "" : `/${locale}`

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <Link
            href={prefix === "" ? "/" : prefix}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block"
          >
            ← ReelHuntr
          </Link>
          <h1 className="text-4xl font-bold text-foreground mt-2">{HEADING[locale] ?? HEADING.en}</h1>
          <p className="text-muted-foreground mt-3 text-lg">{SUBHEADING[locale] ?? SUBHEADING.en}</p>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => {
            const t = getTranslation(post, locale)
            return (
              <Link
                key={post.slug}
                href={`${prefix}/blog/${post.slug}`}
                className="group block bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl shrink-0">{post.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(post.date, locale)} · {post.readTime} {READ_TIME_LABEL[locale] ?? READ_TIME_LABEL.en}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {t.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{t.description}</p>
                    <span className="inline-block mt-3 text-sm text-primary font-medium">
                      {READ_MORE[locale] ?? READ_MORE.en} →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
