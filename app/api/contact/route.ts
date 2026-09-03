import { NextResponse } from 'next/server'
import { supabaseEnv } from '@/lib/supabase/env'

const escape = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, organisation, city, about, message, website } = await req.json()

    // Honeypot: real users never fill the hidden "website" field. Bots do.
    // Silently accept (return success so the bot moves on) but save nothing.
    if (website) {
      return NextResponse.json({ success: true })
    }

    if (!firstName || !lastName || !email || !organisation || !about || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const name = `${String(firstName).trim()} ${String(lastName).trim()}`.trim()

    const supabase = supabaseEnv()
    if (supabase) {
      // contact_submissions has no city column; keep it as the first line of the message.
      await fetch(`${supabase.url}/rest/v1/contact_submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabase.key,
          Authorization: `Bearer ${supabase.key}`,
          Prefer: 'return-minimal',
        },
        body: JSON.stringify({
          name,
          organisation,
          email,
          enquiry: about,
          message: city ? `City: ${city}\n\n${message}` : message,
        }),
      })
    }

    const RESEND_KEY = process.env.RESEND_API_KEY
    if (RESEND_KEY) {
      const rows: Array<[string, unknown]> = [
        ['First name', firstName],
        ['Last name', lastName],
        ['Email', email],
        ['Organisation', organisation],
        ['City', city || '—'],
        ["What's this about?", about],
      ]
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_KEY}`,
        },
        body: JSON.stringify({
          from: 'CityAge <info@cityage.com>',
          to: ['miro@cityage.com'],
          reply_to: email,
          subject: `Contact: ${about} — ${organisation}`,
          html: `
            <div style="font-family: Georgia, serif; max-width: 600px; color: #1a1a1a;">
              <h2 style="font-weight: 300; border-bottom: 1px solid #ddd; padding-bottom: 12px;">
                Contact form
              </h2>
              ${rows.map(([label, value]) => `<p><strong>${label}:</strong> ${label === 'Email' ? `<a href="mailto:${escape(value)}">${escape(value)}</a>` : escape(value)}</p>`).join('\n')}
              <p><strong>Message:</strong></p>
              <p style="background: #f9f9f9; padding: 16px; border-left: 3px solid #C5A059;">
                ${escape(message).replace(/\n/g, '<br>')}
              </p>
            </div>
          `,
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
