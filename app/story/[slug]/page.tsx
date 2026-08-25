import { notFound } from 'next/navigation'
import { StorySheet } from '@/components/story-sheet'
import { storiesBySlug } from '@/lib/issue'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return Object.keys(storiesBySlug).map((slug) => ({ slug }))
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const story = storiesBySlug[slug]
  if (!story) notFound()
  return <StorySheet story={story} />
}
