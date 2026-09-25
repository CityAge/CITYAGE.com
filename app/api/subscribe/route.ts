import { NextResponse } from 'next/server'
import { CITYAGE_PUBLICATION_ID } from '@/lib/beehiiv'
import { supabaseEnv } from '@/lib/supabase/env'

export async function POST(req: Request) {
  let email = ''
  let website = ''
  try {
    const body = await req.json()
    email = typeof body?.email === 'string' ? body.email.trim() : ''
    website = typeof body?.website === 'string' ? body.website.trim() : ''
  } catch {
    return NextResponse.json({ error: 'Need an email.' }, { status: 400 })
  }

  // Honeypot from the locked HTML form. Bots fill "website"; real users do not.
  if (website) {
    return NextResponse.json({ ok: true, success: true })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Need an email.' }, { status: 400 })
  }

  // Beehiiv when configured; otherwise keep the address ourselves so nothing is lost.
  const key = process.env.BEEHIIV_API_KEY
  if (key) {
    try {
      const res = await fetch(
        `https://api.beehiiv.com/v2/publications/${CITYAGE_PUBLICATION_ID}/subscriptions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${key}`,
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
      if (res.ok || res.status === 409) return NextResponse.json({ ok: true, destination: 'beehiiv' })
    } catch {
      /* fall through to the local record */
    }
  }

  const supabase = supabaseEnv()
  if (supabase) {
    try {
      const response = await fetch(`${supabase.url}/rest/v1/contact_submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabase.key,
          Authorization: `Bearer ${supabase.key}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ name: 'Subscribe', email, enquiry: 'Subscribe', message: 'Subscription request from /subscribe', source: 'subscribe' }),
      })
      if (response.ok) return NextResponse.json({ ok: true, destination: 'pending' })
      console.error('[subscribe] fallback save failed', response.status)
    } catch (error) {
      console.error('[subscribe] fallback save failed', error)
    }
  }
  return NextResponse.json({ error: 'Subscription is unavailable. Please try again later.' }, { status: 503 })
}
