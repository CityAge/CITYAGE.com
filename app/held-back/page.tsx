import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

/**
 * Where proxy.ts sends visitors to a page that is held back (see PRIVATE there).
 * It must be a real route: an unknown address would fall through to the archive.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } }

export default function HeldBack() {
  notFound()
}
