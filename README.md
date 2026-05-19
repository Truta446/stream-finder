# ReelHuntr

Find where to watch movies and TV shows across every streaming platform, in 14 countries.

**Live:** [reelhuntr.com](https://reelhuntr.com)

---

## Features

- **Real data** — TMDB as primary source, OMDb as fallback, local mock as last resort
- **14 regions** — AR, BR, CA, CL, CN, CO, DE, ES, GB, IT, MX, PT, RU, US
- **Provider filters** — Netflix, Prime Video, Disney+, Max, Apple TV+, Paramount+
- **Infinite scroll** — paginated popular titles, deduped across pages
- **Trailer playback** — YouTube trailer linked directly from the detail panel
- **URL state** — search query, filters, region and open title all persisted in the URL
- **Region auto-detection** — reads from `navigator.language` on first visit, persisted in localStorage
- **Full SEO** — OG image, JSON-LD (WebSite + SearchAction), sitemap, robots, web manifest

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Runtime | Node.js 24 LTS |
| Language | TypeScript 6 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Data fetching | TanStack Query v5 |
| Package manager | pnpm 10 |
| Deployment | Vercel |

## Data Sources

| Source | Used for |
|---|---|
| [TMDB](https://www.themoviedb.org/) | Search, trending, discover, streaming providers, trailers |
| [OMDb](https://www.omdbapi.com/) | Fallback metadata when TMDB is unavailable |

Streaming provider availability is powered by TMDB's JustWatch integration (`/watch/providers`).

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy env file and fill in your API keys
cp .env.example .env.local

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `TMDB_API_KEY` | Yes | TMDB v3 API key — [get one here](https://www.themoviedb.org/settings/api) |
| `TMDB_READ_TOKEN` | Preferred | TMDB v4 read access token (used over API key when present) |
| `OMDB_API_KEY` | Optional | OMDb API key — [get one here](https://www.omdbapi.com/apikey.aspx) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URL of your deployment (used for OG, sitemap, JSON-LD) |

All keys are read server-side only and never exposed to the client.

## Project Structure

```
app/
  api/popular/      → paginated popular + discover endpoint
  api/search/       → search endpoint (min 2 chars)
  api/title/[id]/   → title detail + streaming providers
components/
  stream-finder/    → MovieCard, TitleDetails, PlatformBadges, SearchBar…
  ui/               → shadcn/ui primitives + PosterImage wrapper
hooks/
  use-titles.ts     → useSearchTitles, usePopularTitles, useTitleDetails
  use-url-state.ts  → URL ↔ state sync (debounced, RAF-coalesced)
  use-region.ts     → region detection + localStorage persistence
lib/api/
  tmdb.ts           → TMDB client (server-only)
  omdb.ts           → OMDb client (server-only)
  aggregator.ts     → cascade logic: TMDB → OMDb → mock
  provider-links.ts → stable deep-link URLs per streaming service
```

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `/` | Focus search bar |
| `Esc` | Clear search / close detail panel |
