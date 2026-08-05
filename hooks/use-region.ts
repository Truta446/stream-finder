"use client"

import { useCallback, useEffect, useState } from "react"
import { isSupportedRegion } from "@/lib/api/types"

const STORAGE_KEY = "sf:region"
const DEFAULT_REGION = "US"

/**
 * Best-effort detection of the user's country, client-only:
 *   1. localStorage (user's last explicit pick)
 *   2. navigator.language / Intl.Locale region tag (e.g. "pt-BR" → "BR")
 *   3. fallback to DEFAULT_REGION
 *
 * Runs after mount, so the first render uses DEFAULT_REGION to keep SSR/CSR
 * markup identical. The detected value lands on the next paint.
 */
function detectRegion(): string {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored && isSupportedRegion(stored)) return stored.toUpperCase()
  } catch {
    /* private mode / disabled storage */
  }

  try {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
    for (const tag of langs) {
      if (!tag) continue
      let region = ""
      try {
        region = new Intl.Locale(tag).region ?? ""
      } catch {
        region = tag.split("-")[1] ?? ""
      }
      if (region && isSupportedRegion(region)) return region.toUpperCase()
    }
  } catch {
    /* navigator unavailable */
  }

  return DEFAULT_REGION
}

export function useRegion(): readonly [string, (next: string) => void] {
  const [region, setRegion] = useState<string>(DEFAULT_REGION)

  useEffect(() => {
    const detected = detectRegion()
    // setState-in-effect is deliberate here: the first render must match the
    // server markup (DEFAULT_REGION); the real region can only be known after
    // mount, so this one-time post-hydration correction is the whole point.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (detected !== region) setRegion(detected)
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const persist = useCallback((next: string) => {
    if (!isSupportedRegion(next)) return
    const code = next.toUpperCase()
    setRegion(code)
    try {
      window.localStorage.setItem(STORAGE_KEY, code)
    } catch {
      /* ignore */
    }
  }, [])

  return [region, persist] as const
}
