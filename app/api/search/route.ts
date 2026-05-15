import { NextResponse, type NextRequest } from "next/server"
import { searchAll } from "@/lib/api/aggregator"
import { isSupportedRegion } from "@/lib/api/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const QUERY_REGEX = /^[\p{L}\p{N}\s\-:'.,!?&()]+$/u
const PROVIDER_IDS = /^[\d,]+$/

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("q") ?? ""
  const q = raw.trim().slice(0, 100)

  if (q.length < 2) {
    return NextResponse.json({ data: [], source: null, triedSources: [] }, { status: 200 })
  }
  if (!QUERY_REGEX.test(q)) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 })
  }

  const region = (req.nextUrl.searchParams.get("region") ?? "US").toUpperCase()
  const safeRegion = isSupportedRegion(region) ? region : "US"
  const providersRaw = req.nextUrl.searchParams.get("providers") ?? ""
  const providerIds =
    PROVIDER_IDS.test(providersRaw) && providersRaw.length > 0
      ? providersRaw
          .split(",")
          .map(Number)
          .filter((n) => Number.isFinite(n) && n > 0)
          .slice(0, 12)
      : []

  const result = await searchAll(
    q,
    providerIds.length > 0 ? { region: safeRegion, providerIds } : undefined,
  )
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
    },
  })
}
