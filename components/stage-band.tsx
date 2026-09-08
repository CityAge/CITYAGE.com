import Link from 'next/link'
import { DoorSpeakersStrip } from '@/components/door-speakers-strip'
import type { SpeakerFace } from '@/lib/speakers'

const LABEL = 'font-serif text-[11px] md:text-[14px] leading-snug uppercase tracking-[0.08em] md:tracking-[0.14em] text-white'

/** Full-width black band above the footer: rule, label, count, then the faces. */
export function StageBand({ top, bottom }: { top: SpeakerFace[]; bottom: SpeakerFace[] }) {
  return (
    <section className="bg-black pt-12 pb-10" style={{ ['--reel-bg' as string]: '#000' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="border-t border-white pt-4 flex items-center gap-3 md:gap-4">
          <span className={LABEL}>The CityAge Stage</span>
          <span aria-hidden="true" className="h-4 w-px shrink-0 bg-[#C5A059]" />
          <Link href="/people" className={`${LABEL} hover:underline underline-offset-4`}>
            1,000+ Leaders
          </Link>
        </div>
      </div>
      <div className="mt-6">
        <DoorSpeakersStrip top={top} bottom={bottom} />
      </div>
    </section>
  )
}
