"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

interface AdUnitProps {
  slot: string
  format?: "auto" | "horizontal" | "rectangle" | "vertical"
  className?: string
}

export function AdUnit({ slot, format = "auto", className }: AdUnitProps) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID
  const pushed = useRef(false)

  useEffect(() => {
    if (!publisherId || !slot || pushed.current) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense not loaded yet — safe to ignore
    }
  }, [publisherId, slot])

  if (!publisherId || !slot) return null

  return (
    <div className={cn("overflow-hidden text-center", className)}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
