'use client'

import dynamic from 'next/dynamic'

export const DoorSpeakersLazy = dynamic(
  () => import('@/components/door-speakers-strip').then((m) => m.DoorSpeakersStrip),
  { ssr: false, loading: () => null },
)
