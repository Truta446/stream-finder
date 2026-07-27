"use client"

import Link from "next/link"
import { Coffee } from "lucide-react"
import { useTranslations } from "next-intl"

export function DonateButton() {
  const t = useTranslations("footer")
  const url = process.env.NEXT_PUBLIC_DONATE_URL
  if (!url) return null
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs text-subtle-foreground hover:text-yellow-400 transition-colors"
    >
      <Coffee className="h-3.5 w-3.5" />
      {t("support")}
    </Link>
  )
}
