import type { Metadata } from "next"
import { LegalLayout } from "@/components/stream-finder/legal-layout"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://stream-finder-navy.vercel.app"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const canonical = locale === "en" ? "/privacy-policy" : `/${locale}/privacy-policy`
  return {
    title: "Privacy Policy · StreamFinder",
    description:
      "Read StreamFinder's privacy policy. We respect your data and only use what's strictly necessary to operate the service.",
    alternates: {
      canonical,
      languages: {
        en: "/privacy-policy",
        es: "/es/privacy-policy",
        "pt-BR": "/pt-BR/privacy-policy",
        "x-default": "/privacy-policy",
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${canonical}`,
      title: "Privacy Policy · StreamFinder",
      description: "How StreamFinder handles your data.",
    },
  }
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="May 18, 2025" locale={locale}>
      <Section title="1. Who We Are">
        <p>
          StreamFinder (<strong>streamfinder</strong>, "we", "us", or "our") is a free streaming
          search engine that helps users discover where to legally watch movies and TV shows across
          major streaming platforms. We are <strong>not</strong> a streaming service, and we do not
          host or distribute any copyrighted content.
        </p>
        <p>
          This policy explains what information we collect, why, and how we protect it when you
          visit <a href={SITE_URL}>{SITE_URL}</a>.
        </p>
      </Section>

      <Section title="2. Information We Collect">
        <h3>2.1 Information you provide</h3>
        <p>
          StreamFinder does not require registration or account creation. The only input we receive
          from you is the search queries you type in the search box. These queries are sent to our
          API to retrieve results and are <strong>not stored</strong> on our servers beyond the
          duration of the request.
        </p>
        <h3>2.2 Information collected automatically</h3>
        <p>
          Like most websites, we collect standard server and analytics data including: IP address
          (anonymised), browser type and version, device type, pages visited, referral URLs, and
          approximate geographic region (country level). This data is processed by{" "}
          <strong>Vercel Analytics</strong> and is used solely to understand aggregate usage
          patterns and improve the service.
        </p>
        <h3>2.3 Cookies and local storage</h3>
        <p>
          We use browser <strong>local storage</strong> (not cookies) to save your preferences
          such as selected region, content type filter, and sort order. This data never leaves your
          device and is not transmitted to our servers.
        </p>
        <p>
          Third-party services embedded on this site (Google AdSense, see §4) may set their own
          cookies. You can opt out via your browser settings or the{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>{" "}
          page.
        </p>
      </Section>

      <Section title="3. How We Use Your Information">
        <ul>
          <li>To process your search queries and return relevant results.</li>
          <li>To remember your region and filter preferences locally.</li>
          <li>To measure aggregate, anonymous traffic to improve the service.</li>
          <li>To display contextually relevant advertisements (see §4).</li>
        </ul>
        <p>
          We do <strong>not</strong> sell, rent, or share personally identifiable information with
          any third party for marketing purposes.
        </p>
      </Section>

      <Section title="4. Advertising (Google AdSense)">
        <p>
          StreamFinder displays advertisements served by{" "}
          <strong>Google AdSense</strong> (publisher ID: ca-pub-4688228012616163). Google uses
          cookies and similar technologies to serve ads based on your visits to this and other
          websites. You can opt out of personalised advertising at{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            adssettings.google.com
          </a>
          .
        </p>
        <p>
          We also participate in the <strong>Amazon Associates</strong> affiliate programme. When
          you click a "Buy" or "Rent" link for Amazon content, we may earn a small commission at
          no extra cost to you. These links are clearly part of the "Buy / Rent" sections on title
          pages.
        </p>
      </Section>

      <Section title="5. Third-Party Services">
        <p>StreamFinder retrieves data from the following third-party APIs:</p>
        <ul>
          <li>
            <strong>TMDB (The Movie Database)</strong> — movie and TV metadata. Uses are governed
            by{" "}
            <a href="https://www.themoviedb.org/privacy-policy" target="_blank" rel="noopener noreferrer">
              TMDB&apos;s Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong>JustWatch</strong> — streaming availability data. Accessed via TMDB&apos;s
            Watch Providers endpoint.
          </li>
          <li>
            <strong>OMDb API</strong> — supplementary ratings data.
          </li>
        </ul>
        <p>
          None of these services receive any personally identifiable information about you from us.
          Requests are made server-side on your behalf.
        </p>
      </Section>

      <Section title="6. Data Retention">
        <p>
          We do not maintain user accounts or persistent user profiles. Server logs (if any) are
          retained for a maximum of 30 days for security and debugging purposes, after which they
          are deleted.
        </p>
      </Section>

      <Section title="7. Your Rights">
        <p>
          Depending on your location, you may have rights under GDPR, CCPA, or other applicable
          laws to access, correct, or delete personal data we hold about you. Since we collect
          minimal data and do not maintain user accounts, most requests can be addressed simply by
          clearing your browser&apos;s local storage.
        </p>
        <p>
          For any privacy-related enquiry, please contact us at the address listed on our{" "}
          <a href="/contact">Contact page</a>.
        </p>
      </Section>

      <Section title="8. Children's Privacy">
        <p>
          StreamFinder is not directed at children under the age of 13. We do not knowingly
          collect personal information from children.
        </p>
      </Section>

      <Section title="9. Changes to This Policy">
        <p>
          We may update this policy from time to time. When we do, we will revise the "Last
          updated" date at the top of this page. We encourage you to review this policy
          periodically.
        </p>
      </Section>
    </LegalLayout>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-foreground mb-3">{title}</h2>
      <div className="text-muted-foreground space-y-3 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-2">
        {children}
      </div>
    </section>
  )
}
