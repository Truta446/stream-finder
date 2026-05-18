import type { Metadata } from "next"
import { Mail, ExternalLink } from "lucide-react"
import { LegalLayout } from "@/components/stream-finder/legal-layout"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://stream-finder-navy.vercel.app"
const CONTACT_EMAIL = "contact@streamfinder.app"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const canonical = locale === "en" ? "/contact" : `/${locale}/contact`
  return {
    title: "Contact · StreamFinder",
    description:
      "Get in touch with StreamFinder. Report a bug, suggest a feature, or ask about advertising and partnerships.",
    alternates: {
      canonical,
      languages: {
        en: "/contact",
        es: "/es/contact",
        "pt-BR": "/pt-BR/contact",
        "x-default": "/contact",
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${canonical}`,
      title: "Contact · StreamFinder",
      description: "Get in touch with the StreamFinder team.",
    },
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <LegalLayout title="Contact" lastUpdated="May 18, 2025" locale={locale}>
      <div className="text-muted-foreground space-y-10">
        <Section title="Get in touch">
          <p>
            StreamFinder is an independent project. There is no large support team behind it, but
            we read every message and do our best to respond within a few business days.
          </p>
          <ContactCard
            icon={<Mail className="h-5 w-5" />}
            label="Email"
            value={CONTACT_EMAIL}
            href={`mailto:${CONTACT_EMAIL}`}
          />
        </Section>

        <Section title="What to write about">
          <TopicCard
            title="Bug reports"
            description="A title showing the wrong streaming platform? A broken link? Let us know the title name, the platform, your country, and what you expected to see."
          />
          <TopicCard
            title="Missing availability"
            description="Streaming availability data comes from TMDB and JustWatch. If a title is missing, it's likely not yet in their database. You can contribute data directly at justwatch.com."
          />
          <TopicCard
            title="Feature suggestions"
            description="Have an idea that would make StreamFinder more useful? We'd love to hear it."
          />
          <TopicCard
            title="Advertising & partnerships"
            description="Interested in advertising on StreamFinder or partnering with us? Reach out with details about your platform or product."
          />
          <TopicCard
            title="Copyright / DMCA"
            description="StreamFinder does not host any content. All data is sourced from TMDB and JustWatch APIs. If you believe there is a data error involving your work, please contact us with specifics."
          />
        </Section>

        <Section title="About StreamFinder">
          <p>
            StreamFinder is a <strong className="text-foreground">legal streaming search engine</strong>.
            We help users find where to watch movies and TV shows on licensed platforms like
            Netflix, Amazon Prime Video, Disney+, Max, Apple TV+, and others. We do not link to,
            promote, or endorse any form of piracy or copyright infringement.
          </p>
          <p>
            Streaming availability data is sourced from TMDB and JustWatch APIs and may not always
            reflect real-time platform catalogues. We update our data regularly but availability
            can change without notice.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <PageLink href="/privacy-policy" label="Privacy Policy" />
            <PageLink href="/terms" label="Terms of Use" />
          </div>
        </Section>
      </div>
    </LegalLayout>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function ContactCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href: string
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-all group mt-4"
    >
      <span className="text-muted-foreground group-hover:text-primary transition-colors">
        {icon}
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </a>
  )
}

function TopicCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-4 rounded-xl border border-border/40 bg-muted/10">
      <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  )
}

function PageLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  )
}
