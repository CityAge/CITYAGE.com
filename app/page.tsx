import Image from 'next/image'
import { MagazineHeader } from '@/components/magazine-header'
import { SubscribeDoor } from '@/components/subscribe-door'

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader issue />

      <div id="lockup" className="border-b border-black/10 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto py-8 md:py-10 text-center">
          <p className="font-serif text-[16px] md:text-[19px] text-black/70 leading-[1.55]">
            We live on the urban planet. Two percent of Earth. Everything happens here.
          </p>
          <p className="font-serif italic text-[14px] md:text-[16px] text-black/45 mt-3">
            CityAge is the small rooms, drawn from 20,000 leaders. Come do the work.
          </p>
        </div>
      </div>

      <main className="flex-grow w-full bg-[#F9F9F7]">
        <article id="cover" className="max-w-[1400px] mx-auto px-6 md:px-12 pt-12 md:pt-16 pb-4">
          <figure className="relative w-full overflow-hidden bg-black/5 aspect-[16/9]">
            <Image
              src="/northern-century-earth.jpg"
              alt="The Arctic from orbit — Greenland and the Circle"
              fill
              priority
              className="object-cover object-center"
            />
          </figure>
          <div className="max-w-[40rem] mt-12 md:mt-16">
            <p className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-black/40">
              Frontiers
            </p>
            <h2 className="font-serif font-black text-[2.6rem] md:text-[4.5rem] lg:text-[5.25rem] leading-[0.94] tracking-tight mt-3">
              The Northern Century
            </h2>
            <p className="font-serif italic text-[20px] md:text-[23px] text-black/55 leading-[1.4] mt-6">
              The Arctic is not the edge of the map.
            </p>
            <div className="font-serif text-[17px] md:text-[18px] text-black/65 leading-[1.7] mt-8 space-y-5">
              <p>
                Most of the planet is empty of us. Ice. Forest. Ocean. The work of the next hundred years will not be done on that emptiness. It will be done on the two percent — the harbours, the grids, the rooms where a city decides what it will be.
              </p>
              <p>
                From Vancouver the north is not a metaphor. It is a coastline, a route, a question of steel and patience. Capital already knows this. Governments are learning it. The people who will decide the northern century will do it with maps on the table, then go home, and the ice will still be there in the morning.
              </p>
            </div>
          </div>
        </article>

        <article id="vancouver" className="max-w-[1400px] mx-auto px-6 md:px-12 mt-24 md:mt-32 pt-16 md:pt-20 border-t border-black/12">
          <div className="max-w-[40rem]">
            <figure className="relative w-full overflow-hidden bg-black/5 aspect-[16/10] mb-10">
              <Image
                src="/vancouver-banner.jpg"
                alt="Lions Gate and the harbour"
                fill
                className="object-cover object-[center_35%]"
              />
            </figure>
            <p className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-black/40">
              Cities
            </p>
            <h3 className="font-serif font-black text-[2rem] md:text-[2.75rem] leading-[1.06] tracking-tight mt-3">
              The Next Metro Vancouver
            </h3>
            <p className="font-serif italic text-[17px] md:text-[19px] text-black/50 leading-[1.5] mt-4">
              Where this region can actually win.
            </p>
            <div className="font-serif text-[17px] md:text-[18px] text-black/65 leading-[1.7] mt-8 space-y-5">
              <p>
                Vancouver looks west at the Pacific and north at a geography most of the world still treats as empty. That is not a brand. It is a fact of the harbour. The question is not whether the region is beautiful. It is whether it will decide what it is for — power, money, cities — before someone else decides for it.
              </p>
              <p>
                The win is not everywhere. It is in the rooms that already know the file: the port, the grid, the builders who can still pour before the weather turns. A metro that cannot say that out loud will spend the decade decorating the view.
              </p>
            </div>
          </div>
        </article>

        <article id="letter" className="max-w-[1400px] mx-auto px-6 md:px-12 mt-24 md:mt-32 pt-16 md:pt-20 border-t border-black/12 pb-8">
          <div className="max-w-[40rem]">
            <p className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-black/40">
              Power
            </p>
            <h3 className="font-serif font-black text-[2rem] md:text-[2.55rem] leading-[1.08] tracking-tight mt-3">
              The Influence Letter
            </h3>
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-black/35 mt-4">
              Miro Cernetig · Publisher
            </p>

            <div className="font-serif text-[17px] md:text-[18px] text-black/70 leading-[1.75] mt-10 space-y-6">
              <p>
                We live on the urban planet. Two percent of Earth. Everything happens here.
              </p>
              <p>
                I keep that sentence because it is true in a way a slogan is not. Most of the planet does not have us on it. The two percent is the harbour and the street and the table where a decision becomes a crane. If you want to know where the next century will be spent, do not start with a continent. Start with a city.
              </p>
              <p>
                I have spent my working life in rooms that do not look like much. A table. A window that faces the water, or the mountains, or a parking lot. Twelve people. Sometimes eight. The people who can move a port, a pension, a northern road. CityAge is those rooms — drawn from twenty thousand leaders who already carry the file. Not an audience. The people who stay after the easy talk is over.
              </p>
              <p>
                We are not here to fill a hall. Halls are easy. Rooms are hard. In a room you cannot hide behind a programme. Someone has to say what they will fund, what they will permit, what they will refuse. That is the work. Come do the work.
              </p>
              <p>
                Power is who sits down first. Money is whether the steel gets poured before the weather turns. Cities are where both become a skyline. I write from Vancouver. It looks west and north at the same time. That is not poetry. It is the harbour, and it is the ice, and it is late.
              </p>
              <p>
                The north is the test. The Arctic is not the edge of the map. Capital knows this. The people who will decide the northern century will not do it for a crowd. They will do it in small rooms, with maps on the table, and then they will go home. The ice will still be there in the morning. So will the two percent.
              </p>
              <p>
                Culture is what a city tells itself after the money has left the building. I care about it because the rooms go wrong when they forget what the street is for. Twenty thousand leaders is not a list I wave around. It is the number of people, over years, who have sat down and told the truth about a place. This paper is a way to keep that conversation on a page.
              </p>
              <p>
                This is for them. I will write what I see. You will overwrite what is wrong. That is how a magazine is supposed to work.
              </p>
            </div>
          </div>
        </article>

        <div id="subscribe" className="max-w-[1400px] mx-auto px-6 md:px-12 mt-20 md:mt-28 pt-12 border-t border-black/10 pb-24 md:pb-32">
          <div className="max-w-[40rem]">
            <SubscribeDoor />
          </div>
        </div>
      </main>

      <footer className="border-t border-black px-6 md:px-12 py-12 md:py-16 bg-[#F9F9F7]">
        <div className="max-w-[1400px] mx-auto">
          <p className="font-serif font-black uppercase tracking-[0.06em] text-2xl">CITYAGE</p>
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-black/40 mt-3">
            everything happens on earth&rsquo;s 2%.
          </p>
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-black/40 mt-2">
            Publisher · Miro Cernetig · Vancouver
          </p>
        </div>
      </footer>
    </div>
  )
}
