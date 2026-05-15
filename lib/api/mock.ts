import type { Title } from "./types"
import { mockTitles as legacy } from "../mock-data"

const mockTitles: Title[] = legacy.map((t) => ({ ...t, source: "mock" }))

export function mockSearch(query: string): Title[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return mockTitles.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.genres.some((g) => g.toLowerCase().includes(q)),
  )
}

export function mockPopular(): Title[] {
  return mockTitles.slice(0, 6)
}

export function mockDetails(id: string): Title | null {
  const direct = mockTitles.find((t) => t.id === id)
  if (direct) return direct
  const m = /^mock:(.+)$/.exec(id)
  if (m) return mockTitles.find((t) => t.id === m[1]) ?? null
  return null
}
