import Image from 'next/image'
import Link from 'next/link'
import { adjacentLeaves, coverPlate, lauraStory } from '@/lib/issue'

export function CoverSpread() {
  const { next } = adjacentLeaves('/')

  return (
    <div className="h-dvh overflow-hidden grid grid-rows-[auto_1fr_auto] lg:grid-rows-1 lg:grid-cols-[minmax(22rem,42%)_1fr]">
      <section className="px-6 pt-7 pb-5 md:px-10 lg:h-dvh lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-12 xl:px-16 xl:py-14">
        <div>
          <h1 className="font-serif font-black uppercase monocle-wordmark text-[3.35rem] leading-[0.78] tracking-[0.03em] md:text-[4.6rem] lg:text-[6.4vw] xl:text-[7rem]">
            CITYAGE
          </h1>
          <p className="mt-4 md:mt-5 font-mono text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-black/45">
            everything happens on earth&rsquo;s 2%.
          </p>
          <p className="mt-6 lg:mt-10 font-mono text-[10px] tracking-[0.16em] uppercase text-black/40 leading-[1.7]">
            Publisher
            <br />
            Miro Cernetig
          </p>
        </div>

        <div className="hidden lg:block max-w-[22rem]">
          <p className="font-serif text-[18px] leading-[1.5] text-black/80">
            We live on the urban planet. Two percent of Earth. Everything happens here.
          </p>
          {next && (
            <Link
              href={next.href}
              className="mt-10 inline-block font-mono text-[10px] tracking-[0.22em] uppercase text-black/45 hover:text-black transition-colors"
            >
              Next
            </Link>
          )}
        </div>
      </section>

      <figure className="relative min-h-0 bg-black/5">
        <Image
          src={coverPlate.image}
          alt={coverPlate.imageAlt}
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover object-center"
        />
      </figure>

      <div className="px-6 pt-4 pb-6 md:px-10 lg:hidden">
        <p className="font-serif text-[16px] leading-[1.5] text-black/80 max-w-[22rem]">
          We live on the urban planet. Two percent of Earth. Everything happens here.
        </p>
        {next && (
          <Link
            href={lauraStory.href}
            className="mt-4 inline-block font-mono text-[10px] tracking-[0.22em] uppercase text-black/45 hover:text-black transition-colors"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  )
}
