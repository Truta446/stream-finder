import { NextResponse, type NextRequest } from "next/server"
import { detailsAll } from "@/lib/api/aggregator"

export const runtime = "nodejs"
export const revalidate = 3600

const ID_REGEX = /^[a-z0-9:_-]+$/i

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  if (!id || !ID_REGEX.test(id) || id.length > 64) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }
  const result = await detailsAll(decodeURIComponent(id))
  if (!result.data) {
    return NextResponse.json({ error: "Not found", triedSources: result.triedSources }, { status: 404 })
  }
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
