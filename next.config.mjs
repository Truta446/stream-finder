import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production"

// Dev needs eval() + websockets for HMR / React DevTools / Turbopack overlay.
// Production locks everything down.
const csp = isProd
  ? [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "object-src 'none'",
      "img-src 'self' data: blob: https://image.tmdb.org https://images.justwatch.com https://*.tmdb.org https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.gstatic.com",
      "media-src 'self'",
      "script-src 'self' 'unsafe-inline' https://*.googlesyndication.com https://*.googleadservices.com https://adservice.google.com",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "connect-src 'self' https://api.themoviedb.org https://www.omdbapi.com https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net",
      "frame-src 'self' https://*.doubleclick.net https://*.googlesyndication.com https://www.google.com",
      "manifest-src 'self'",
      "worker-src 'self' blob:",
      "upgrade-insecure-requests",
    ].join("; ")
  : [
      "default-src 'self'",
      "img-src 'self' data: blob: https:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "connect-src 'self' ws: wss: http: https:",
      "worker-src 'self' blob:",
    ].join("; ")

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  ...(isProd
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy", value: csp },
]

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-dropdown-menu", "@radix-ui/react-dialog"],
  },
  images: {
    // Images are served straight from the origin CDNs (TMDB / JustWatch) via a
    // custom loader instead of Vercel's Image Optimization. The optimizer bills
    // one transformation per unique source × width × quality, and blowing past
    // the Hobby quota makes `/_next/image` return 402 — which breaks every
    // poster on the site at once. TMDB already serves fixed size buckets, so
    // the loader picks the right bucket per breakpoint and costs us nothing.
    loader: "custom",
    loaderFile: "./lib/utils/image-loader.ts",
    // Kept so the srcset widths the loader receives stay sane; the 2048/3840
    // defaults could only ever ask for upscales of a w500/w1280 source.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**" },
      { protocol: "https", hostname: "images.justwatch.com", pathname: "/**" },
      { protocol: "https", hostname: "m.media-amazon.com", pathname: "/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
