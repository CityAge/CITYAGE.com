import Image from 'next/image'
import Link from 'next/link'
import { adjacentLeaves, coverPlate } from '@/lib/issue'

export function CoverSpread() {
  const { next } = adjacentLeaves('/')

  return (
    <div className="h-dvh overflow-hidden grid grid-rows-[auto_minmax(0,1fr)_auto] lg:grid-rows-1 lg:grid-cols-[minmax(20rem,1fr)_minmax(0,1.2fr)]">
      <section className="cover-paper min-w-0 flex flex-col justify-between px-6 pt-7 pb-5 md:px-10 lg:h-dvh lg:px-12 lg:py-12 xl:px-14 xl:py-14">
        <div>
          <h1 className="cover-wordmark">
            CITYAGE
          </h1>
          <p className="mt-5 lg:mt-8 font-mono text-[10px] tracking-[0.16em] uppercase text-black/40 leading-[1.7]">
            Publisher / Miro Cernetig
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
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover object-[center_60%]"
        />
      </figure>

      <div className="px-6 pt-4 pb-6 md:px-10 lg:hidden">
        <p className="font-serif text-[16px] leading-[1.5] text-black/80 max-w-[22rem]">
          We live on the urban planet. Two percent of Earth. Everything happens here.
        </p>
        {next && (
          <Link
            href={next.href}
            className="mt-4 inline-block font-mono text-[10px] tracking-[0.22em] uppercase text-black/45 hover:text-black transition-colors"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  )
}
