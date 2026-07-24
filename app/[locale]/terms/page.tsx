import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import { LegalLayout } from "@/components/stream-finder/legal-layout"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://reelhuntr.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const canonical = locale === "en" ? "/terms" : `/${locale}/terms`
  return {
    title: "Terms of Use · ReelHuntr",
    description:
      "Terms and conditions for using ReelHuntr. A free, legal streaming search engine — not a piracy site.",
    alternates: {
      canonical,
      languages: {
        en: "/terms",
        es: "/es/terms",
        "pt-BR": "/pt-BR/terms",
        "x-default": "/terms",
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${canonical}`,
      title: "Terms of Use · ReelHuntr",
      description: "Terms and conditions for using ReelHuntr.",
    },
  }
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <LegalLayout title="Terms of Use" lastUpdated="May 18, 2025" locale={locale}>
      <Section title="1. About ReelHuntr">
        <p>
          ReelHuntr is a <strong>streaming search engine</strong>. We index publicly available
          information about which movies and TV shows are available on licensed streaming platforms
          (such as Netflix, Amazon Prime Video, Disney+, Max, Apple TV+, and others) and present
          that information in a convenient, searchable interface.
        </p>
        <p>
          <strong>ReelHuntr does not host, store, distribute, or link to pirated content.</strong>{" "}
          Every "Watch now" link on our site points directly to the official streaming platform
          where the title is legally available. We are a discovery tool, not a streaming service.
        </p>
      </Section>

      <Section title="2. Acceptance of Terms">
        <p>
          By accessing or using ReelHuntr at <a href={SITE_URL}>{SITE_URL}</a>, you agree to
          be bound by these Terms of Use. If you do not agree, please do not use the service.
        </p>
      </Section>

      <Section title="3. Permitted Use">
        <p>You may use ReelHuntr to:</p>
        <ul>
          <li>Search for movies and TV shows available on legal streaming platforms.</li>
          <li>Discover on which platforms a specific title is available in your country.</li>
          <li>Navigate to official streaming platforms to watch content legally.</li>
        </ul>
        <p>You may not use ReelHuntr to:</p>
        <ul>
          <li>Circumvent, bypass, or interfere with any streaming platform&apos;s DRM or geo-restrictions.</li>
          <li>Scrape, crawl, or systematically extract data from this site at scale without prior written consent.</li>
          <li>Use the service in any manner that could damage, disable, or impair our infrastructure.</li>
          <li>Attempt to gain unauthorised access to any portion of the service or its related systems.</li>
        </ul>
      </Section>

      <Section title="4. Intellectual Property">
        <p>
          All movie and TV show metadata, posters, and descriptions displayed on ReelHuntr are
          sourced from <strong>TMDB (The Movie Database)</strong>, <strong>JustWatch</strong>, and{" "}
          <strong>OMDb</strong> under their respective API terms. This product uses the TMDB API
          but is not endorsed or certified by TMDB. All media titles, logos, and trademarks are
          the property of their respective rights holders.
        </p>
        <p>
          ReelHuntr&apos;s own code, design, and original content are protected by copyright. You
          may not reproduce or redistribute them without permission.
        </p>
      </Section>

      <Section title="5. Affiliate Links and Advertising">
        <p>
          ReelHuntr participates in affiliate programmes including{" "}
          <strong>Amazon Associates</strong> and <strong>Apple Services Performance Partners</strong>.
          When you click certain links and make a purchase or subscription, we may earn a
          commission at no additional cost to you. Affiliate links are always in the context of
          "Buy" or "Rent" options on official platforms — we never recommend illegal sources.
        </p>
        <p>
          We display advertisements served by <strong>Google AdSense</strong>. Advertisements are
          clearly separated from organic search results and editorial content.
        </p>
      </Section>

      <Section title="6. Disclaimer of Warranties">
        <p>
          ReelHuntr is provided &quot;as is&quot; without warranty of any kind. Streaming
          availability data is sourced from third-party APIs and may be outdated or inaccurate. We
          make no guarantee that any title listed as available on a platform will be accessible to
          you at the time of your visit. Availability can change without notice.
        </p>
      </Section>

      <Section title="7. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, ReelHuntr and its operators shall not be
          liable for any indirect, incidental, or consequential damages arising from your use of or
          inability to use the service.
        </p>
      </Section>

      <Section title="8. Third-Party Links">
        <p>
          ReelHuntr contains links to third-party streaming platforms. These are provided for
          your convenience. We have no control over, and assume no responsibility for, the content,
          privacy policies, or practices of any third-party sites.
        </p>
      </Section>

      <Section title="9. Changes to These Terms">
        <p>
          We reserve the right to modify these terms at any time. Changes take effect immediately
          upon posting. Your continued use of ReelHuntr after any changes constitutes your
          acceptance of the new terms.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions about these terms? Visit our <a href="/contact">Contact page</a>.
        </p>
      </Section>
    </LegalLayout>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-foreground mb-3">{title}</h2>
      <div className="text-muted-foreground space-y-3 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </section>
  )
}
