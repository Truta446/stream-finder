import Link from "next/link"
import { User } from "lucide-react"
import { Star } from "lucide-react"
import type { CastMember, RelatedTitle } from "@/lib/api/types"
import type { FaqItem } from "@/lib/title-content"
import { PosterImage } from "@/components/ui/poster-image"
import { buildTitleUrl } from "@/lib/utils/slug"

/**
 * Server-rendered editorial sections for the title pages (cast, similar
 * titles, FAQ). These exist to give each title page substantial, indexable
 * content beyond the raw provider grid.
 */

export function CastSection({ heading, cast }: { heading: string; cast: CastMember[] }) {
  if (cast.length === 0) return null
  return (
    <section className="mt-10 border-t border-border/50 pt-8" aria-label={heading}>
      <h2 className="text-xl font-bold text-foreground mb-4">{heading}</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {cast.map((member) => (
          <li key={`${member.name}-${member.character}`} className="flex items-center gap-3 min-w-0">
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-secondary shrink-0">
              {member.profile ? (
                <PosterImage
                  src={member.profile}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                  fallbackIconSize={20}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <User className="h-5 w-5" aria-hidden />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
              {member.character && (
                <p className="text-xs text-muted-foreground truncate">{member.character}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function RelatedSection({
  heading,
  related,
  locale,
}: {
  heading: string
  related: RelatedTitle[]
  locale: string
}) {
  if (related.length === 0) return null
  return (
    <section className="mt-10 border-t border-border/50 pt-8" aria-label={heading}>
      <h2 className="text-xl font-bold text-foreground mb-4">{heading}</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
        {related.map((item) => (
          <Link
            key={item.id}
            href={buildTitleUrl(locale, item.type, item.title, item.id)}
            className="group block"
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary ring-1 ring-border/50 group-hover:ring-primary/60 transition-all">
              <PosterImage
                src={item.poster}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 12vw"
                fallbackIconSize={24}
              />
            </div>
            <p className="mt-1.5 text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {item.title}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              {item.year > 0 && <span>{item.year}</span>}
              {item.rating > 0 && (
                <span className="inline-flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" aria-hidden />
                  {item.rating.toFixed(1)}
                </span>
              )}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function FaqSection({
  heading,
  faq,
  lastCheckedNote,
}: {
  heading: string
  faq: FaqItem[]
  lastCheckedNote: string
}) {
  if (faq.length === 0) return null
  return (
    <section className="mt-10 border-t border-border/50 pt-8" aria-label={heading}>
      <h2 className="text-xl font-bold text-foreground mb-4">{heading}</h2>
      <div className="space-y-4 max-w-3xl">
        {faq.map((item) => (
          <div key={item.question} className="rounded-xl border border-border/40 bg-muted/10 p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1.5">{item.question}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-subtle-foreground mt-4 max-w-3xl">{lastCheckedNote}</p>
    </section>
  )
}
