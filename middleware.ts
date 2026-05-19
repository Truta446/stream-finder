import createMiddleware from "next-intl/middleware"
import { NextResponse, type NextRequest } from "next/server"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

// Simple in-memory rate limiter: 60 API requests per minute per IP.
// Resets per serverless instance — good enough to blunt naive scrapers.
const hits = new Map<string, { count: number; reset: number }>()
const LIMIT = 60
const WINDOW_MS = 60_000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS })
    return false
  }
  entry.count++
  if (entry.count > LIMIT) return true
  return false
}

export function middleware(req: NextRequest) {
  // Only rate-limit the API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown"

    if (isRateLimited(ip)) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": "60" },
      })
    }
    return NextResponse.next()
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)", "/"],
}
