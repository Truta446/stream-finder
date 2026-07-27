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
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://*.googlesyndication.com https://*.googleadservices.com https://adservice.google.com",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "connect-src 'self' https://api.themoviedb.org https://www.omdbapi.com https://vitals.vercel-insights.com https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net",
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
    formats: ["image/avif", "image/webp"],
    // 75 is the default; 65 is opted in for the decorative detail-page backdrop,
    // which is the LCP element and sits under a gradient overlay, so the extra
    // bytes buy nothing visible. Next.js rejects any quality not listed here.
    qualities: [65, 75],
    // Every source we optimize is a TMDB w500 poster / w1280 backdrop or a small
    // provider icon, so the default 2048 and 3840 variants could only ever be
    // upscales — dropping them keeps the generated srcsets honest.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**" },
      { protocol: "https", hostname: "images.justwatch.com", pathname: "/**" },
      { protocol: "https", hostname: "m.media-amazon.com", pathname: "/**" },
    ],
    minimumCacheTTL: 60 * 60 * 24,
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
