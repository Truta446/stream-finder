import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { ArrowLeft, Star, Calendar, Clock, Film, ExternalLink, PlayCircle } from "lucide-react"
import type { Metadata } from "next"
import { detailsAll } from "@/lib/api/aggregator"
import { parseSlugId } from "@/lib/utils/slug"
import { Badge } from "@/components/ui/badge"
import { PosterImage } from "@/components/ui/poster-image"
import { ProvidersSection } from "@/components/stream-finder/providers-section"
import { LanguageSelector } from "@/components/stream-finder/language-selector"

type Params = Promise<{ locale: string; slug: string }>
type SearchParams = Promise<{ region?: string }>

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { locale, slug } = await params
  const id = parseSlugId(slug, "movie")
  if (!id) return {}

  const result = await detailsAll(id)
  const title = result?.data
  if (!title) return {}

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://reelhuntr.com"
  const localePrefix = locale === "en" ? "" : `/${locale}`
  const canonical = `${SITE_URL}${localePrefix}/movie/${slug}`

  return {
    title: `${title.title} (${title.year}) — ReelHuntr`,
    description: title.description || `Find where to watch ${title.title} online.`,
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}/movie/${slug}`,
        es: `${SITE_URL}/es/movie/${slug}`,
        "pt-BR": `${SITE_URL}/pt-BR/movie/${slug}`,
        "x-default": `${SITE_URL}/movie/${slug}`,
      },
    },
    openGraph: {
      type: "video.movie",
      url: canonical,
      title: `${title.title} (${title.year})`,
      description: title.description || `Find where to watch ${title.title} online.`,
      images: title.poster ? [{ url: title.poster, width: 500, height: 750, alt: title.title }] : [],
    },
  }
}

export default async function MoviePage({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const { locale, slug } = await params
  const { region } = await searchParams

  const id = parseSlugId(slug, "movie")
  if (!id) notFound()

  const result = await detailsAll(id)
  const title = result?.data
  if (!title) notFound()

  const t = await getTranslations({ locale })
  const localePrefix = locale === "en" ? "" : `/${locale}`

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://reelhuntr.com"
  const canonical = `${SITE_URL}${localePrefix}/movie/${slug}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Movie",
        name: title.title,
        url: canonical,
        ...(title.poster ? { image: title.poster } : {}),
        ...(title.description ? { description: title.description } : {}),
        ...(title.year ? { datePublished: String(title.year) } : {}),
        ...(title.genres.length > 0 ? { genre: title.genres } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ReelHuntr", item: `${SITE_URL}${localePrefix}/` },
          { "@type": "ListItem", position: 2, name: title.title, item: canonical },
        ],
      },
    ],
  }

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-background outline-none">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Back navigation */}
      <div className="container mx-auto px-4 pt-4 flex items-center justify-between gap-2 mb-4">
        <Link
          href={`${localePrefix}/`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          ReelHuntr
        </Link>
        <LanguageSelector />
      </div>

      {/* Backdrop */}
      <div className="relative h-48 sm:h-64 md:h-80 w-full bg-secondary/40">
        <PosterImage
          src={title.backdrop}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
          quality={65}
          fallbackIconSize={64}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col sm:flex-row gap-6 -mt-24 sm:-mt-28 relative">
          {/* Poster */}
          {/*
            The full-width backdrop above is the LCP candidate on every
            breakpoint, so it keeps fetchpriority="high" (PosterImage defaults to
            it for priority images). This poster only needs to be eager.
          */}
          <div className="relative h-44 w-28 sm:h-56 sm:w-36 rounded-xl overflow-hidden shadow-2xl flex-shrink-0 mx-auto sm:mx-0 ring-2 ring-card bg-secondary">
            <PosterImage
              src={title.poster}
              alt={`${title.title} poster`}
              fill
              className="object-cover"
              sizes="144px"
              priority
              fetchPriority="auto"
              fallbackIconSize={32}
            />
          </div>

          {/* Title info */}
          <div className="flex-1 pt-2 sm:pt-28 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 flex-wrap">
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                <Film className="h-3 w-3 mr-1" />
                {t("details.movie")}
              </Badge>
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="h-4 w-4 fill-yellow-400" />
                <span className="font-semibold">{title.rating.toFixed(1)}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold text-foreground text-balance mb-2">
              {title.title}
            </h1>

            <div className="flex items-center justify-center sm:justify-start gap-4 text-muted-foreground text-sm mb-4 flex-wrap">
              {title.year && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {title.year}
                </span>
              )}
              {title.runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {title.runtime}
                </span>
              )}
            </div>

            {title.genres.length > 0 && (
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                {title.genres.map((genre) => (
                  <Badge key={genre} variant="outline" className="border-border text-muted-foreground">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}

            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              {title.description || t("details.noDescription")}
            </p>

            {title.trailerKey && (
              <a
                href={`https://www.youtube.com/watch?v=${title.trailerKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
              >
                <PlayCircle className="h-4 w-4" />
                {t("details.watchTrailer")}
                <ExternalLink className="h-3.5 w-3.5 opacity-70" />
              </a>
            )}
          </div>
        </div>

        {/* Providers */}
        <div className="mt-10 border-t border-border/50 pt-8">
          <ProvidersSection
            providers={title.providers}
            titleText={title.title}
            initialRegion={region?.toUpperCase()}
          />
        </div>
      </div>
    </main>
  )
}
