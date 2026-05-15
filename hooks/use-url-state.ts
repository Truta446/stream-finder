"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef } from "react"

export interface UrlPatch {
  q?: string
  p?: string[]
  region?: string
  id?: string | null
  type?: "all" | "movie" | "tv"
  sort?: string
}

/**
 * URL ↔ state mirror. Reads return stable primitives derived from the
 * search params, writes coalesce within a tick so multiple setX in one render
 * produce a single router.replace.
 *
 * Defaults match "absent from URL": q="", p=[], region="", id=null,
 * type="all", sort="popularity". When a value matches its default we strip
 * the key from the URL to keep links short.
 */
export function useUrlState() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const q = searchParams.get("q") ?? ""
  const pRaw = searchParams.get("p") ?? ""
  const region = (searchParams.get("region") ?? "").toUpperCase()
  const id = searchParams.get("id")
  const type = (searchParams.get("type") ?? "all") as "all" | "movie" | "tv"
  const sort = searchParams.get("sort") ?? "popularity"

  const p = useMemo(() => (pRaw ? pRaw.split(",").filter(Boolean) : []), [pRaw])

  const queueRef = useRef<UrlPatch | null>(null)
  const rafRef = useRef<number | null>(null)
  const pushRef = useRef(false)

  const write = useCallback(
    (patch: UrlPatch, push = false) => {
      queueRef.current = { ...(queueRef.current ?? {}), ...patch }
      if (push) pushRef.current = true
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const merged = queueRef.current!
        queueRef.current = null
        const shouldPush = pushRef.current
        pushRef.current = false

        const current = new URLSearchParams(searchParams.toString())

        const apply = (key: string, value: string | undefined) => {
          if (value === undefined || value === "") current.delete(key)
          else current.set(key, value)
        }

        if (merged.q !== undefined) apply("q", merged.q.trim())
        if (merged.p !== undefined) apply("p", merged.p.join(","))
        if (merged.region !== undefined) apply("region", merged.region.toUpperCase())
        if (merged.id !== undefined) apply("id", merged.id ?? "")
        if (merged.type !== undefined) apply("type", merged.type === "all" ? "" : merged.type)
        if (merged.sort !== undefined)
          apply("sort", merged.sort === "popularity" ? "" : merged.sort)

        const qs = current.toString()
        const url = qs ? `${pathname}?${qs}` : pathname
        if (shouldPush) router.push(url, { scroll: false })
        else router.replace(url, { scroll: false })
      })
    },
    [pathname, router, searchParams],
  )

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { q, p, region, id, type, sort, write }
}
