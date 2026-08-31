import { NextResponse } from 'next/server'
import { CITYAGE_PUBLICATION_ID } from '@/lib/beehiiv'

export async function POST(req: Request) {
  let email = ''
  try {
    const body = await req.json()
    email = typeof body?.email === 'string' ? body.email.trim() : ''
  } catch {
    return NextResponse.json({ error: 'Need an email.' }, { status: 400 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Need an email.' }, { status: 400 })
  }

  const key = process.env.BEEHIIV_API_KEY
  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${CITYAGE_PUBLICATION_ID}/subscriptions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(key ? { Authorization: `Bearer ${key}` } : {}),
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: 'magazine',
        referring_site: 'https://cityage.com/subscribe',
      }),
    },
  )

  if (res.ok || res.status === 409) {
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Try again.' }, { status: 502 })
}
