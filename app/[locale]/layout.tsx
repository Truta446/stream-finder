import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { QueryProvider } from "@/components/providers/query-provider"
import { Toaster } from "@/components/ui/sonner"
import { routing } from "@/i18n/routing"
import "../globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", preload: false })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://reelhuntr.com"
const SITE_NAME = "ReelHuntr"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark light",
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "meta" })

  const canonicalPath = locale === "en" ? "/" : `/${locale}`

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: `%s · ${SITE_NAME}`,
    },
    description: t("description"),
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    generator: "Next.js",
    keywords: [
      "where to watch",
      "streaming",
      "Netflix",
      "Prime Video",
      "Disney Plus",
      "Max",
      "Apple TV",
      "Paramount Plus",
      "movie streaming search",
      "TV show streaming",
      "JustWatch alternative",
    ],
    category: "entertainment",
    referrer: "origin-when-cross-origin",
    formatDetection: { telephone: false, email: false, address: false },
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: "/",
        es: "/es",
        "pt-BR": "/pt-BR",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: t("title"),
      description: t("description"),
      url: `${SITE_URL}${canonicalPath}`,
      locale: locale === "pt-BR" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "ReelHuntr — find where to watch movies and TV shows",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/opengraph-image"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    manifest: "/manifest.webmanifest",
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const messages = await getMessages()
  const t = await getTranslations({ locale })

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: locale,
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#org`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
      },
    ],
  }

  return (
    <html lang={locale} className={`dark ${geist.variable} ${geistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.justwatch.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.themoviedb.org" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
        <meta name="google-adsense-account" content="ca-pub-4688228012616163" />
      </head>
      <body className="font-sans antialiased bg-background min-h-screen" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {t("a11y.skipToContent")}
        </a>
        <Script id="ld-website" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify(jsonLd)}
        </Script>
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
        )}
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>{children}</QueryProvider>
        </NextIntlClientProvider>
        <Toaster position="bottom-right" richColors closeButton />
        {process.env.NODE_ENV === "production" && <Analytics />}
        {process.env.NODE_ENV === "production" && <SpeedInsights />}
      </body>
    </html>
  )
}
