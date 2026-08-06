"use client"

import type { ImageLoaderProps } from "next/image"

/**
 * Custom next/image loader that bypasses Vercel's Image Optimization entirely.
 *
 * Every image we render already comes from a CDN that serves pre-resized
 * variants (TMDB exposes fixed size buckets in the URL path; JustWatch serves
 * small fixed-size icons), so routing them through `/_next/image` bought us
 * only a format change (AVIF/WebP) at the cost of one billed transformation
 * per unique source × width × quality combination. On the Hobby plan that
 * quota is finite — once exhausted, `/_next/image` returns 402 and *every*
 * poster on the site breaks.
 *
 * Serving straight from the origin CDN is free, unlimited, and globally
 * cached. We keep responsive behaviour by mapping the width next/image asks
 * for onto the nearest TMDB size bucket, so phones still download small files.
 */

/** TMDB poster/profile buckets, ascending. */
const POSTER_WIDTHS = [92, 154, 185, 342, 500, 780] as const
/** TMDB backdrop buckets, ascending. */
const BACKDROP_WIDTHS = [300, 780, 1280] as const

function nearestBucket(widths: readonly number[], target: number): number {
  for (const w of widths) {
    if (w >= target) return w
  }
  return widths[widths.length - 1]
}

export default function tmdbImageLoader({ src, width }: ImageLoaderProps): string {
  // Local assets (/placeholder.jpg, /platforms/*.svg) and anything that isn't
  // a TMDB image is returned untouched — there is nothing to resize.
  if (!src.startsWith("https://image.tmdb.org/t/p/")) return src

  // TMDB paths look like: https://image.tmdb.org/t/p/<size>/<hash>.jpg
  const match = src.match(/^(https:\/\/image\.tmdb\.org\/t\/p\/)([^/]+)(\/.+)$/)
  if (!match) return src

  const [, base, size, path] = match

  // `original` is unbounded and only used where we deliberately want full size.
  if (size === "original") return src

  // Backdrops use the w1280 bucket set; everything else (posters, profiles)
  // uses the poster set. Pick the bucket by what the current size implies.
  const isBackdrop = size === "w1280" || size === "w780" || size === "w300"
  const buckets = isBackdrop ? BACKDROP_WIDTHS : POSTER_WIDTHS

  // Never upscale past the size the caller originally asked for.
  const currentWidth = Number(size.replace(/^w/, "")) || buckets[buckets.length - 1]
  const capped = Math.min(width, currentWidth)

  return `${base}w${nearestBucket(buckets, capped)}${path}`
}
