import Link from 'next/link'

export function IssueLeaf({
  children,
}: {
  href?: string
  children: React.ReactNode
  cover?: boolean
}) {
  return (
    <div className="min-h-dvh bg-[#F9F9F7] text-black flex flex-col selection:bg-black selection:text-[#F9F9F7]">
      <header className="px-5 sm:px-8 md:px-10 pt-6 pb-2">
        <Link
          href="/"
          className="font-serif font-black uppercase monocle-wordmark text-[1.7rem] md:text-[2.1rem] leading-none tracking-[0.035em]"
        >
          CITYAGE
        </Link>
      </header>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  )
}
