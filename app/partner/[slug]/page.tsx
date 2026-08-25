import { notFound } from 'next/navigation'
import { StorySheet } from '@/components/story-sheet'
import { partnersBySlug } from '@/lib/issue'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return Object.keys(partnersBySlug).map((slug) => ({ slug }))
}

export default async function PartnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = partnersBySlug[slug]
  if (!story) notFound()
  return <StorySheet story={story} />
}
