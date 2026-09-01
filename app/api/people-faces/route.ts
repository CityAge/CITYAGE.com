import { NextResponse } from 'next/server'
import { fetchPeopleWallFaces } from '@/lib/speakers'

export const revalidate = 3600

export async function GET() {
  const faces = await fetchPeopleWallFaces()
  return NextResponse.json(faces, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
