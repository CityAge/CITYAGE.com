import Image from 'next/image'
import Link from 'next/link'
import { SubscribeDoor } from '@/components/subscribe-door'
import { frontHeadlines, frontLead, railHeadlines, type FrontHeadline } from '@/lib/issue'

function HeadlineLine({ item }: { item: FrontHeadline }) {
  const mark = (
    <>
      <span className="font-display font-black text-[1.15rem] md:text-[1.28rem] leading-[1.22] tracking-tight">
        {item.title}
      </span>
      {item.byline && (
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-black/40 ml-2">
          — {item.byline}
        </span>
      )}
      {item.partner && (
        <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-black/40 ml-2">
          CityAge partner
        </span>
      )}
    </>
  )

  if (item.href) {
    return (
      <Link href={item.href} className="block py-[0.55rem] hover:underline underline-offset-2">
        {mark}
      </Link>
    )
  }

  return <p className="py-[0.55rem]">{mark}</p>
}

export function FrontPage() {
  return (
    <div className="min-h-dvh bg-[#F9F9F7] text-black selection:bg-black selection:text-[#F9F9F7]">
      <header className="px-5 sm:px-8 md:px-10 pt-7 pb-5 md:pt-8 md:pb-6">
        <div className="mx-auto w-full max-w-[54rem]">
          <p className="front-wordmark">CITYAGE</p>
          <p className="mt-3 font-mono text-[10px] tracking-[0.18em] uppercase text-black/40">
            Publisher / Miro Cernetig
          </p>
          <p className="mt-4 font-serif text-[14px] md:text-[15px] leading-[1.45] text-black/70 max-w-[34em]">
            We live on the urban planet. Two percent of Earth. Everything happens here.
          </p>
        </div>
      </header>

      <div className="border-t border-black/25" />

      <main className="px-5 sm:px-8 md:px-10">
        <div className="mx-auto w-full max-w-[54rem] pt-6 md:pt-8">
          <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-black/35">
            Tuesday, 25 August 2026
          </p>

          <article className="mt-4 md:mt-5 md:grid md:grid-cols-[minmax(0,1fr)_10.75rem] md:gap-8 md:items-start">
            <div>
              <h1 className="font-display font-black text-[2.05rem] sm:text-[2.45rem] md:text-[2.85rem] leading-[1.02] tracking-tight">
                <Link href={frontLead.href} className="hover:underline underline-offset-4">
                  {frontLead.title}
                </Link>
              </h1>
              <p className="font-serif italic text-[17px] md:text-[18px] text-black/55 leading-[1.4] mt-3 max-w-[28em]">
                {frontLead.dek}
              </p>
            </div>
            {frontLead.image && (
              <figure className="relative mt-5 md:mt-1 w-[10.75rem] aspect-[4/3] overflow-hidden bg-black/5">
                <Image
                  src={frontLead.image}
                  alt={frontLead.imageAlt || ''}
                  fill
                  priority
                  sizes="172px"
                  className="object-cover object-[center_60%]"
                />
              </figure>
            )}
          </article>
        </div>

        <div className="mx-auto w-full max-w-[54rem] mt-6 md:mt-8 border-t border-black/20 pt-1 md:grid md:grid-cols-[minmax(0,1fr)_13rem] md:gap-x-10 md:items-start">
          <section aria-label="Headlines">
            {frontHeadlines.map((item) => (
              <div key={item.title} className="border-b border-black/10">
                <HeadlineLine item={item} />
              </div>
            ))}
          </section>

          <aside
            aria-label="More headlines"
            className="mt-8 md:mt-0 md:border-l md:border-black/15 md:pl-6 pt-1"
          >
            {railHeadlines.map((item) => (
              <p
                key={item.title}
                className="py-[0.45rem] border-b border-black/10 font-serif text-[15px] md:text-[16px] leading-[1.3] text-black/80"
              >
                {item.title}
              </p>
            ))}
          </aside>
        </div>

        <div
          id="subscribe"
          className="mx-auto w-full max-w-[54rem] mt-10 md:mt-12 border-t border-black/25 pt-8 pb-16 md:pb-20"
        >
          <SubscribeDoor />
        </div>
      </main>
    </div>
  )
}
