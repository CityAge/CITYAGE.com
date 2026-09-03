'use server'

import { appendNextWestRow } from './sheet'

export type InviteResult = { ok: true } | { ok: false }

function text(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    if (char === '&') return '&amp;'
    if (char === '<') return '&lt;'
    if (char === '>') return '&gt;'
    if (char === '"') return '&quot;'
    return '&#39;'
  })
}

function yesNo(value: boolean) {
  return value ? 'Yes' : 'No'
}

function submittedAtPT() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Vancouver',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())
}

async function sendResend(payload: {
  firstName: string
  lastName: string
  title: string
  organization: string
  email: string
  postalCode: string
  city: string
  attend: boolean
  speak: boolean
  knowledgePartner: boolean
  comments: string
  submitted: string
}) {
  const key = process.env.RESEND_API_KEY
  if (!key) return false
  const name = `${payload.firstName} ${payload.lastName}`
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      from: 'CityAge <info@cityage.com>',
      to: ['info@cityage.com'],
      reply_to: payload.email,
      subject: `Next West invitation — ${name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; color: #1a1a1a;">
          <h2 style="font-weight: 300; border-bottom: 1px solid #ddd; padding-bottom: 12px;">
            Next West invitation
          </h2>
          <p><strong>First Name:</strong> ${escapeHtml(payload.firstName)}</p>
          <p><strong>Last Name:</strong> ${escapeHtml(payload.lastName)}</p>
          <p><strong>Title:</strong> ${escapeHtml(payload.title)}</p>
          <p><strong>Organization:</strong> ${escapeHtml(payload.organization)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></p>
          <p><strong>Postal Code:</strong> ${escapeHtml(payload.postalCode)}</p>
          <p><strong>City:</strong> ${escapeHtml(payload.city)}</p>
          <p><strong>Attend:</strong> ${yesNo(payload.attend)}</p>
          <p><strong>Speak:</strong> ${yesNo(payload.speak)}</p>
          <p><strong>Knowledge partner:</strong> ${yesNo(payload.knowledgePartner)}</p>
          <p><strong>Comments:</strong></p>
          <p style="background: #f9f9f9; padding: 16px; border-left: 3px solid #C5A059;">
            ${escapeHtml(payload.comments || '—').replace(/\n/g, '<br>')}
          </p>
          <p><strong>Submitted (PT):</strong> ${escapeHtml(payload.submitted)}</p>
        </div>
      `,
    }),
  })
  return res.ok
}

async function sendFormsubmit(payload: {
  firstName: string
  lastName: string
  title: string
  organization: string
  email: string
  postalCode: string
  city: string
  attend: boolean
  speak: boolean
  knowledgePartner: boolean
  comments: string
  submitted: string
}) {
  const name = `${payload.firstName} ${payload.lastName}`
  const res = await fetch('https://formsubmit.co/ajax/info@cityage.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: `Next West invitation — ${name}`,
      first_name: payload.firstName,
      last_name: payload.lastName,
      title: payload.title,
      organization: payload.organization,
      email: payload.email,
      postal_code: payload.postalCode,
      city: payload.city,
      attend: yesNo(payload.attend),
      speak: yesNo(payload.speak),
      knowledge_partner: yesNo(payload.knowledgePartner),
      comments: payload.comments,
      submitted_pt: payload.submitted,
    }),
  })
  return res.ok
}

export async function submitNextWestInvite(formData: FormData): Promise<InviteResult> {
  if (text(formData, 'website')) {
    return { ok: true }
  }

  const firstName = text(formData, 'firstName')
  const lastName = text(formData, 'lastName')
  const title = text(formData, 'title')
  const organization = text(formData, 'organization')
  const email = text(formData, 'email')
  const postalCode = text(formData, 'postalCode')
  const city = text(formData, 'city')
  const comments = text(formData, 'comments')
  const attend = formData.get('attend') === 'on'
  const speak = formData.get('speak') === 'on'
  const knowledgePartner = formData.get('knowledgePartner') === 'on'

  const fields = [firstName, lastName, title, organization, email, postalCode, city]
  if (fields.some((field) => !field || field.length > 200)) {
    return { ok: false }
  }
  if (comments.length > 4000) {
    return { ok: false }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false }
  }

  const submitted = submittedAtPT()
  const payload = {
    firstName,
    lastName,
    title,
    organization,
    email,
    postalCode,
    city,
    attend,
    speak,
    knowledgePartner,
    comments,
    submitted,
  }

  const mailed = (await sendResend(payload)) || (await sendFormsubmit(payload))
  if (!mailed) {
    return { ok: false }
  }

  try {
    await appendNextWestRow([
      submitted,
      firstName,
      lastName,
      title,
      organization,
      email,
      postalCode,
      city,
      yesNo(attend),
      yesNo(speak),
      yesNo(knowledgePartner),
      comments,
    ])
  } catch {
    // Sheet is best-effort. Mail already left.
  }

  return { ok: true }
}
