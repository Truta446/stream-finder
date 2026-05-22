import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { LanguageSelector } from "./language-selector"

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  locale: string
  children: React.ReactNode
}

export function LegalLayout({ title, lastUpdated, locale, children }: LegalLayoutProps) {
  const homeHref = locale === "en" ? "/" : `/${locale}`
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between gap-2 mb-8">
          <Link
            href={homeHref}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            ReelHuntr
          </Link>
          <LanguageSelector />
        </div>
        <article className="prose prose-invert prose-sm max-w-none">
          <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-sm text-muted-foreground mb-10">Last updated: {lastUpdated}</p>
          {children}
        </article>
      </div>
    </div>
  )
}
