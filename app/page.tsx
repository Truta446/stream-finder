// This file is intentionally empty.
// All routing is handled by app/[locale]/page.tsx via next-intl middleware.
import { notFound } from "next/navigation"
export default function RootPage() {
  notFound()
}
