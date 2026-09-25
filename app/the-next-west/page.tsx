import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import { NoteForm } from '@/components/note-form'
import { EventTemplate, type EventContent } from '@/components/events/event-template'

export const metadata: Metadata = {
  title: 'The Next West — CityAge',
  description: 'Ideas. Investment. Action. A CityAge gathering in Vancouver.',
  robots: { index: false, follow: false },
}

const event: EventContent = {
  title: 'The Next West', tagline: 'Ideas. Investment. Action.',
  location: 'Vancouver', timing: 'Date and venue to be confirmed',
  thesis: 'What will shape the next chapter of the West? CityAge brings leaders together to explore the ideas, investment and partnerships that can move it forward.',
  image: '/next-west-harbour-dawn.jpg', tugImage: '/next-west-tug-layer.webp', dayImage: '/vancouver-banner.jpg', imageAlt: 'Edited view based on the existing Vancouver photograph: Stanley Park and downtown beyond Lions Gate Bridge, with a small coloured tug approaching the main span.',
  themes: [
    { title: 'Capital', description: 'Connecting investment with the ideas and people building the West.' },
    { title: 'Infrastructure', description: 'The ports, airports, hospitals and networks shaping what comes next.' },
    { title: 'Innovation', description: 'Turning research and new technologies into real-world progress.' },
  ],
  // Add only confirmed, approved participants. Both reels support names, roles,
  // organisations and optional portrait URLs. Empty arrays show labelled preview cards.
  speakers: [], attendees: [],
  agenda: [
    { time: 'Time TBC', title: 'Opening conversation', description: 'The opportunity ahead for the West.' },
    { time: 'Time TBC', title: 'The working sessions', description: 'Ideas, investment and the partnerships that turn them into action.' },
    { time: 'Time TBC', title: 'Next steps', description: 'What happens after the conversation.' },
  ],
}

export default function TheNextWestPage() {
  // The event is not announced. A later explicit release decision removes this gate.
  if (process.env.VERCEL_ENV === 'production') notFound()
  return <div className="min-h-screen flex flex-col"><MagazineHeader />
    <EventTemplate event={event} preview enquiry={<NoteForm source="the-next-west" subject="The Next West" tone="dark" />} />
    <MagazineFooter />
  </div>
}
