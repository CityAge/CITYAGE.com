import { IssueLeaf } from '@/components/issue-leaf'
import { SubscribeDoor } from '@/components/subscribe-door'
import { roomLeaf } from '@/lib/issue'

export const metadata = {
  title: 'The Next Metro Vancouver | CityAge',
}

export default function RoomPage() {
  return (
    <IssueLeaf href={roomLeaf.href}>
      <article className="w-full px-6 md:px-12 pt-10 md:pt-16 pb-20 md:pb-28 flex-1 flex flex-col">
        <div className="mx-auto w-full max-w-[34rem] flex-1 flex flex-col">
          <h1 className="font-serif font-black text-[2.2rem] md:text-[3rem] leading-[1.05] tracking-tight">
            {roomLeaf.title}
          </h1>
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-black/40 mt-6">
            {roomLeaf.place}
          </p>
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-black/40 mt-2">
            {roomLeaf.date}
          </p>
          <p className="font-serif text-[18px] md:text-[19px] text-black/75 leading-[1.55] mt-10">
            {roomLeaf.sentence}
          </p>
          <div className="mt-auto pt-16">
            <SubscribeDoor />
          </div>
        </div>
      </article>
    </IssueLeaf>
  )
}
