"use client"

import Image, { type ImageProps } from "next/image"
import { ImageOff } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

/**
 * 4x6 SVG (matches 2:3 poster aspect) filled with the card bg colour, base64'd.
 * Renders inline on first paint so the user sees something even before JS hydrates
 * — Next.js inlines this as the `placeholder="blur"` background.
 */
const POSTER_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0IDYiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjYiIGZpbGw9IiMxZDIyMzAiLz48L3N2Zz4="

interface PosterImageProps extends Omit<ImageProps, "placeholder" | "blurDataURL"> {
  /** When true, render a pulsing skeleton layer behind the image until it loads. */
  showSkeleton?: boolean
  fallbackIconSize?: number
}

/**
 * <Image> wrapper that combines:
 *   • a static blur placeholder for first-paint friendliness,
 *   • a pulsing skeleton layer behind it that fades out when the image arrives,
 *   • a graceful broken-image fallback when the URL 404s.
 *
 * The parent must be `position: relative` since the skeleton is absolutely
 * positioned to overlay the image area.
 */
export function PosterImage({
  className,
  showSkeleton = true,
  fallbackIconSize = 32,
  onLoad,
  onError,
  alt,
  ...props
}: PosterImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        role="img"
        aria-label={typeof alt === "string" ? alt : "Image unavailable"}
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-secondary/50 text-muted-foreground",
          className,
        )}
      >
        <ImageOff style={{ width: fallbackIconSize, height: fallbackIconSize }} />
      </div>
    )
  }

  return (
    <>
      {showSkeleton && !loaded && (
        <div className="absolute inset-0 bg-secondary animate-pulse" aria-hidden />
      )}
      <Image
        {...props}
        alt={alt}
        placeholder="blur"
        blurDataURL={POSTER_BLUR}
        onLoad={(e) => {
          setLoaded(true)
          onLoad?.(e)
        }}
        onError={(e) => {
          setFailed(true)
          onError?.(e)
        }}
        className={cn(
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </>
  )
}
