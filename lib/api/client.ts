import type { Title } from "./types"

export interface ApiEnvelope<T> {
  data: T
  source: "tmdb" | "omdb" | "mock" | null
  triedSources: Array<{ source: string; ok: boolean; error?: string }>
  page?: number
  hasMore?: boolean
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, headers: { Accept: "application/json" } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return (await res.json()) as T
}

interface FilterParams {
  region?: string
  providerIds?: number[]
  page?: number
}

function buildFilter(params: FilterParams): string {
  const search = new URLSearchParams()
  if (params.region) search.set("region", params.region)
  if (params.providerIds && params.providerIds.length > 0) {
    search.set("providers", params.providerIds.join(","))
  }
  if (params.page && params.page > 1) search.set("page", String(params.page))
  const s = search.toString()
  return s ? `&${s}` : ""
}

export function searchTitlesApi(query: string, filter: FilterParams = {}, signal?: AbortSignal) {
  return fetchJson<ApiEnvelope<Title[]>>(
    `/api/search?q=${encodeURIComponent(query)}${buildFilter(filter)}`,
    signal,
  )
}

export function popularTitlesApi(filter: FilterParams = {}, signal?: AbortSignal) {
  const search = new URLSearchParams()
  if (filter.region) search.set("region", filter.region)
  if (filter.providerIds && filter.providerIds.length > 0) {
    search.set("providers", filter.providerIds.join(","))
  }
  if (filter.page && filter.page > 1) search.set("page", String(filter.page))
  const qs = search.toString()
  return fetchJson<ApiEnvelope<Title[]>>(`/api/popular${qs ? `?${qs}` : ""}`, signal)
}

export function titleDetailsApi(id: string, signal?: AbortSignal) {
  return fetchJson<ApiEnvelope<Title | null>>(`/api/title/${encodeURIComponent(id)}`, signal)
}
