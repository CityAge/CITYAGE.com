import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import { SpeakersClient } from './network-client'

export const metadata: Metadata = {
  title: 'The Network — CityAge',
  description: 'Since 2012, CityAge has convened more than 500 leaders from across The Urban Planet.',
}

export const revalidate = 3600
export const dynamic = 'force-dynamic'

export default async function NetworkPage() {
  let speakers: any[] = []

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      const supabase = await createClient()
      const { data } = await supabase
        .from('speakers')
        .select('id, name, title, organisation, photo_url, event_name, city, year, linkedin_url')
        .order('year', { ascending: false })
        .order('name', { ascending: true })
      speakers = data || []
    }
  } catch (e) {
    console.error('Supabase error:', e)
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <MagazineHeader />
      <SpeakersClient speakers={speakers} />
      <MagazineFooter />
    </div>
  )
}
