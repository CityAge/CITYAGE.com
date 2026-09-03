'use client'

import { useEffect, useState } from 'react'

const LABEL = 'font-serif text-[12px] leading-none uppercase tracking-[0.08em] text-[#6B6B6B]'
const LINK = 'font-serif text-[12px] leading-none uppercase tracking-[0.08em] text-black hover:underline underline-offset-4'

/**
 * SHARE · LinkedIn · X · Email · Copy link. Text only, no icons, no colour.
 * Copy link puts the article URL on the clipboard and reads "Copied" for two seconds.
 */
export function ShareRow({ url, title, align = 'start' }: { url: string; title: string; align?: 'start' | 'center' }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(t)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      /* clipboard unavailable: leave the label alone */
    }
  }

  const links = [
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { label: 'X', href: `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
    { label: 'Email', href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}` },
  ]

  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${align === 'center' ? 'justify-center' : ''}`}>
      <span className={LABEL}>Share</span>
      {links.map((link) => (
        <span key={link.label} className="flex items-center gap-x-3">
          <a href={link.href} target={link.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener" className={LINK}>
            {link.label}
          </a>
          <span className="text-black/25" aria-hidden="true">·</span>
        </span>
      ))}
      <button type="button" onClick={copy} className={LINK} aria-live="polite">
        {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  )
}
