import { NextResponse } from 'next/server'
import { CITYAGE_PUBLICATION_ID } from '@/lib/beehiiv'
import { supabaseEnv } from '@/lib/supabase/env'

export async function POST(req: Request) {
  if (req.headers.get('sec-fetch-site') === 'cross-site') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const origin = req.headers.get('origin')
  if (origin && origin !== new URL(req.url).origin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (req.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return NextResponse.json({ error: 'Expected JSON' }, { status: 415 })
  }

  const reader = req.body?.getReader()
  if (!reader) return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  let raw = ''
  let bytes = 0
  const decoder = new TextDecoder()
  let body: Record<string, unknown>
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > 16384) {
        await reader.cancel()
        return NextResponse.json({ error: 'Request too large' }, { status: 413 })
      }
      raw += decoder.decode(value, { stream: true })
    }
    raw += decoder.decode()
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 })
    }
    body = parsed as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  } finally {
    reader.releaseLock()
  }

  // Discard honeypot submissions without storing an address.
  if (typeof body.website === 'string' && body.website.trim()) {
    return NextResponse.json({ ok: true })
  }
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const interests = typeof body.interests === 'string' ? body.interests.trim() : ''
  if (!email || email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Need a valid email.' }, { status: 400 })
  }
  if (interests.length > 2000) {
    return NextResponse.json({ error: 'Please keep interests under 2,000 characters.' }, { status: 400 })
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
  if (!supabase) return NextResponse.json({ error: 'Signup unavailable.' }, { status: 503 })
  try {
    const res = await fetch(`${supabase.url}/rest/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabase.key,
        Authorization: `Bearer ${supabase.key}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name: 'Subscribe',
        email,
        enquiry: 'Subscribe',
        source: 'subscribe',
        message: JSON.stringify({
          kind: 'newsletter_signup',
          consent_text: 'By subscribing, you ask to receive the CityAge newsletter by email.',
          form_version: '2026-09-08',
          interests: interests || null,
          beehiiv_status: 'pending',
        }),
      }),
    })
    if (!res.ok) {
      console.error('[subscribe] storage rejected signup', res.status)
      return NextResponse.json({ error: 'Could not save signup.' }, { status: 503 })
    }
  } catch {
    return NextResponse.json({ error: 'Could not save signup.' }, { status: 503 })
  }
  return NextResponse.json({ ok: true, destination: 'pending' })
}
