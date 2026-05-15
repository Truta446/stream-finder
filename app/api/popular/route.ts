import { NextResponse, type NextRequest } from "next/server"
import { popularAll } from "@/lib/api/aggregator"
import { isSupportedRegion } from "@/lib/api/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const PROVIDER_IDS = /^[\d,]+$/

export async function GET(req: NextRequest) {
  const region = (req.nextUrl.searchParams.get("region") ?? "US").toUpperCase()
  const providersRaw = req.nextUrl.searchParams.get("providers") ?? ""

  const providerIds =
    PROVIDER_IDS.test(providersRaw) && providersRaw.length > 0
      ? providersRaw
          .split(",")
          .map(Number)
          .filter((n) => Number.isFinite(n) && n > 0)
          .slice(0, 12)
      : []

  const safeRegion = isSupportedRegion(region) ? region : "US"
  const pageRaw = Number(req.nextUrl.searchParams.get("page") ?? "1")
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.min(50, Math.floor(pageRaw)) : 1

  const result = await popularAll({ region: safeRegion, providerIds, page })

  const cacheKey = providerIds.length > 0 ? "private" : "public"
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": `${cacheKey}, s-maxage=1800, stale-while-revalidate=86400`,
    },
  })
}
