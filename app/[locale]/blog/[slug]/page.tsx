import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { routing } from "@/i18n/routing"
import { posts, getPost, getTranslation, formatDate } from "@/lib/blog"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://reelhuntr.com"

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    posts.map((post) => ({ locale, slug: post.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  const t = getTranslation(post, locale)
  const canonical = locale === "en" ? `/blog/${slug}` : `/${locale}/blog/${slug}`
  return {
    title: `${t.title} · ReelHuntr`,
    description: t.description,
    alternates: {
      canonical,
      languages: {
        en: `/blog/${slug}`,
        es: `/es/blog/${slug}`,
        "pt-BR": `/pt-BR/blog/${slug}`,
        "x-default": `/blog/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      url: `${SITE_URL}${canonical}`,
      title: t.title,
      description: t.description,
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: ["ReelHuntr"],
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
    },
  }
}

const BACK: Record<string, string> = {
  en: "← Back to Blog",
  es: "← Volver al Blog",
  "pt-BR": "← Voltar ao Blog",
}

const READ_TIME_LABEL: Record<string, string> = {
  en: "min read",
  es: "min de lectura",
  "pt-BR": "min de leitura",
}

const CTA_HEADING: Record<string, string> = {
  en: "Find where to watch any of these titles",
  es: "Encuentra dónde ver cualquiera de estos títulos",
  "pt-BR": "Encontre onde assistir qualquer um desses títulos",
}

const CTA_BODY: Record<string, string> = {
  en: "Search across Netflix, Prime Video, Disney+, Max, Apple TV+, and more — for free, no account needed.",
  es: "Busca en Netflix, Prime Video, Disney+, Max, Apple TV+ y más — gratis, sin necesidad de cuenta.",
  "pt-BR": "Pesquise na Netflix, Prime Video, Disney+, Max, Apple TV+ e mais — de graça, sem cadastro.",
}

const CTA_BTN: Record<string, string> = {
  en: "Search on ReelHuntr →",
  es: "Buscar en ReelHuntr →",
  "pt-BR": "Pesquisar no ReelHuntr →",
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const t = getTranslation(post, locale)
  const prefix = locale === "en" ? "" : `/${locale}`
  const canonical = `${SITE_URL}${prefix}/blog/${slug}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: t.title,
        description: t.description,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: locale,
        articleSection: post.category,
        author: { "@type": "Organization", name: "ReelHuntr", url: SITE_URL },
        publisher: {
          "@type": "Organization",
          name: "ReelHuntr",
          logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ReelHuntr", item: `${SITE_URL}${prefix}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}${prefix}/blog` },
          { "@type": "ListItem", position: 3, name: t.title, item: canonical },
        ],
      },
    ],
  }

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background outline-none">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Link
          href={`${prefix}/blog`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block"
        >
          {BACK[locale] ?? BACK.en}
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(post.date, locale)} · {post.readTime}{" "}
              {READ_TIME_LABEL[locale] ?? READ_TIME_LABEL.en}
            </span>
          </div>
          <div className="text-5xl mb-4">{post.emoji}</div>
          <h1 className="text-3xl font-bold text-foreground leading-tight">{t.title}</h1>
          <p className="text-muted-foreground mt-3 text-lg leading-relaxed">{t.description}</p>
        </div>

        <article
          className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-foreground prose-a:text-primary prose-li:text-muted-foreground max-w-none"
          dangerouslySetInnerHTML={{ __html: t.html }}
        />

        <div className="mt-12 bg-primary/10 border border-primary/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            {CTA_HEADING[locale] ?? CTA_HEADING.en}
          </h2>
          <p className="text-muted-foreground text-sm mb-4">{CTA_BODY[locale] ?? CTA_BODY.en}</p>
          <Link
            href={prefix === "" ? "/" : prefix}
            className="inline-flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {CTA_BTN[locale] ?? CTA_BTN.en}
          </Link>
        </div>
      </div>
    </main>
  )
}
