/**
 * Per-provider deep links.
 *
 * TMDB / JustWatch gives us a single per-title landing URL per region. That URL
 * (entry.link) lands on a JustWatch page that DOES have "Watch on Netflix /
 * Disney+ / Max" deep-link buttons — i.e. it's per-title accurate.
 *
 * For providers whose own search URL is stable and ergonomic across regions, we
 * prefer sending the user straight to that provider's site. For everything else
 * (Disney+ SPA routing, Max login gates, region-specific Paramount+/Movistar+
 * routes, etc.) we deliberately FALL THROUGH to the JustWatch link so the user
 * lands on a page that already knows where to go.
 *
 * Match is by lowercased provider name. Region affects multi-TLD providers
 * (Amazon → amazon.com.br / amazon.com / amazon.es / etc.).
 */

type LinkBuilder = (title: string, region: string) => string

const enc = encodeURIComponent

const AMAZON_TLD: Record<string, string> = {
  US: "com",
  CA: "ca",
  BR: "com.br",
  MX: "com.mx",
  AR: "com.br", // no Amazon.ar — Brazilian site has wider LATAM stock
  CL: "com.br",
  CO: "com.co",
  ES: "es",
  PT: "es", // no Amazon.pt — redirects to ES
  GB: "co.uk",
  IT: "it",
  DE: "de",
  FR: "fr",
  CN: "cn",
  RU: "com", // no Amazon.ru — fall back to global
}

function amazon(t: string, r: string) {
  const tld = AMAZON_TLD[r] ?? "com"
  return `https://www.amazon.${tld}/s?k=${enc(t)}&i=instant-video`
}

/** Only providers with proven, stable, public search URLs go here. */
const builders: Record<string, LinkBuilder> = {
  netflix: (t) => `https://www.netflix.com/search?q=${enc(t)}`,

  "amazon prime video": amazon,
  "prime video": amazon,
  "amazon video": amazon,

  hulu: (t) => `https://www.hulu.com/search?q=${enc(t)}`,

  "apple tv": (t) => `https://tv.apple.com/search?term=${enc(t)}`,
  "apple tv+": (t) => `https://tv.apple.com/search?term=${enc(t)}`,
  "apple tv plus": (t) => `https://tv.apple.com/search?term=${enc(t)}`,

  peacock: (t) => `https://www.peacocktv.com/search?q=${enc(t)}`,
  "peacock premium": (t) => `https://www.peacocktv.com/search?q=${enc(t)}`,

  youtube: (t) => `https://www.youtube.com/results?search_query=${enc(t)}`,
  "youtube premium": (t) => `https://www.youtube.com/results?search_query=${enc(t)}`,

  "google play movies": (t) => `https://play.google.com/store/search?q=${enc(t)}&c=movies`,

  "fandango at home": (t) => `https://athome.fandango.com/browse/search?searchTerm=${enc(t)}`,
  vudu: (t) => `https://athome.fandango.com/browse/search?searchTerm=${enc(t)}`,

  plex: (t) => `https://watch.plex.tv/search?q=${enc(t)}`,

  crunchyroll: (t) => `https://www.crunchyroll.com/search?q=${enc(t)}`,

  tubi: (t) => `https://tubitv.com/search/${enc(t)}`,
  "tubi tv": (t) => `https://tubitv.com/search/${enc(t)}`,

  "pluto tv": (t) => `https://pluto.tv/en/search/details?query=${enc(t)}`,

  globoplay: (t) => `https://globoplay.globo.com/busca/?q=${enc(t)}`,

  // INTENTIONALLY NOT MAPPED (fall through to JustWatch per-title link instead):
  //   Disney+      — /search?q= returns the public 404 page.
  //   Max          — login gate makes search URL unreliable from external entry.
  //   Paramount+   — search route differs per locale, frequently 404s outside US.
  //   Movistar+    — Spain-only, sign-in wall hides the public search.
  //   Mercado Play — landing page works but search query param isn't honoured externally.
}

export function providerDeepLink(
  providerName: string,
  title: string,
  region: string,
  fallback: string,
): string {
  const key = providerName.trim().toLowerCase()
  const builder = builders[key]
  if (builder) return builder(title, region)
  return fallback && fallback !== "#" ? fallback : "#"
}
