import Link from 'next/link'
import { adjacentLeaves } from '@/lib/issue'

export function IssueLeaf({
  href,
  children,
  cover = false,
}: {
  href: string
  children: React.ReactNode
  cover?: boolean
}) {
  const { prev, next } = adjacentLeaves(href)

  return (
    <div className="min-h-dvh bg-[#F9F9F7] text-black flex flex-col selection:bg-black selection:text-[#F9F9F7]">
      {!cover && (
        <header className="px-6 md:px-12 pt-6 pb-2 flex items-baseline justify-between gap-6">
          <Link
            href="/"
            className="font-serif font-black uppercase monocle-wordmark text-[1.7rem] md:text-[2.1rem] leading-none tracking-[0.035em]"
          >
            CITYAGE
          </Link>
          <nav className="font-mono text-[10px] tracking-[0.2em] uppercase text-black/40 flex gap-6">
            {prev ? (
              <Link href={prev.href} className="hover:text-black transition-colors">
                Previous
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={next.href} className="hover:text-black transition-colors">
                Next
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </header>
      )}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  )
}
