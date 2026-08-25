import { IssueLeaf } from '@/components/issue-leaf'
import { publisherLetter } from '@/lib/issue'

export const metadata = {
  title: 'From the publisher | CityAge',
}

export default function LetterPage() {
  return (
    <IssueLeaf href={publisherLetter.href}>
      <article className="w-full px-6 md:px-12 pt-10 md:pt-16 pb-20 md:pb-28">
        <div className="mx-auto w-full max-w-[62ch]">
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-black/40">
            {publisherLetter.kicker}
          </p>
          <div className="font-serif text-[18px] md:text-[19px] text-black/80 leading-[1.7] mt-10 space-y-6">
            {publisherLetter.sentences.map((sentence) => (
              <p key={sentence}>{sentence}</p>
            ))}
          </div>
          <p className="font-serif mt-12 text-[18px] text-black">
            {publisherLetter.sign}
          </p>
        </div>
      </article>
    </IssueLeaf>
  )
}
