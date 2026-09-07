import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { supabaseEnv } from '@/lib/supabase/env'

export const runtime = 'nodejs'

/**
 * The one door for every note on the site.
 *
 * 1. A row is written to contact_submissions first, every time. That row is the guarantee.
 * 2. Then the notification goes to info@cityage.com through Google Workspace SMTP
 *    (nodemailer, smtp.gmail.com:465, SMTP_USER / SMTP_PASS). Success or failure is
 *    recorded on the row (email_sent, email_error) with the service key, and the
 *    reader sees the success state either way.
 */
const TO = 'info@cityage.com'
const SUBJECTS = new Set(['sponsoring', 'speaking', 'The Northern Century', 'The Next West', 'the Studio', 'press', 'something else'])

const text = (v: unknown, max = 2000) => String(v ?? '').trim().slice(0, max)

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  // Honeypot: real people never fill the hidden "website" field. Bots do. Accept and save nothing.
  if (text(body.website)) return NextResponse.json({ success: true })

  const name = text(body.name, 200)
  const organisation = text(body.organisation, 200)
  const email = text(body.email, 320)
  const subject = text(body.subject, 100)
  const message = text(body.message, 20000)
  const source = text(body.source, 100) || 'contact'
  if (!name || !email || !subject || !message || !SUBJECTS.has(subject) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = supabaseEnv()
  if (!supabase) {
    console.error('[contact] no Supabase environment; note not stored')
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  // 1. The row, before anything else. The id is minted here: the public key can insert but not read back.
  const rowId = crypto.randomUUID()
  try {
    const res = await fetch(`${supabase.url}/rest/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabase.key,
        Authorization: `Bearer ${supabase.key}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ id: rowId, name, organisation: organisation || null, email, enquiry: subject, message, source, email_sent: false }),
    })
    if (!res.ok) throw new Error(`insert ${res.status}: ${(await res.text()).slice(0, 200)}`)
  } catch (err) {
    console.error('[contact] row not written', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  // 2. The notification.
  let emailSent = false
  let emailError: string | null = null
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!user || !pass) {
    emailError = 'SMTP_USER or SMTP_PASS not set'
  } else {
    try {
      const rowLink = `https://supabase.com/dashboard/project/${new URL(supabase.url).hostname.split('.')[0]}/editor?table=contact_submissions`
      const transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } })
      await transporter.sendMail({
        from: user,
        to: TO,
        replyTo: email,
        subject: `Note from ${name}${organisation ? `, ${organisation}` : ''} — ${subject}`,
        text: [
          `${name}${organisation ? `, ${organisation}` : ''}`,
          `${email}`,
          `About: ${subject}`,
          `From the page: /${source}`,
          '',
          message,
          '',
          `Row ${rowId}: ${rowLink}`,
        ].join('\n'),
      })
      emailSent = true
    } catch (err) {
      emailError = err instanceof Error ? err.message.slice(0, 500) : String(err).slice(0, 500)
    }
  }
  if (!emailSent) console.error('[contact] notification not sent', { rowId, emailError })

  // 3. Record the outcome on the row. Needs the service key: the public key can insert but not update.
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (service) {
    try {
      const res = await fetch(`${supabase.url}/rest/v1/contact_submissions?id=eq.${rowId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', apikey: service, Authorization: `Bearer ${service}`, Prefer: 'return=minimal' },
        body: JSON.stringify({ email_sent: emailSent, email_error: emailError }),
      })
      if (!res.ok) console.error('[contact] row not updated', res.status, (await res.text()).slice(0, 200))
    } catch (err) {
      console.error('[contact] row not updated', err)
    }
  } else {
    console.warn('[contact] SUPABASE_SERVICE_ROLE_KEY not set; email_sent left at false on row', rowId)
  }

  return NextResponse.json({ success: true })
}
