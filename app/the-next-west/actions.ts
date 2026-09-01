'use server'

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
  const speak = formData.get('speak') === 'on'
  const knowledgePartner = formData.get('knowledgePartner') === 'on'

  const fields = [firstName, lastName, title, organization, email, postalCode, city]
  if (fields.some((field) => !field || field.length > 200)) {
    return { ok: false }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false }
  }

  const key = process.env.RESEND_API_KEY
  if (!key) {
    return { ok: false }
  }

  const name = `${firstName} ${lastName}`
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      from: 'CityAge <info@cityage.com>',
      to: ['info@cityage.com', 'miro@cityage.com'],
      reply_to: email,
      subject: `The Next West invitation — ${name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; color: #1a1a1a;">
          <h2 style="font-weight: 300; border-bottom: 1px solid #ddd; padding-bottom: 12px;">
            The Next West — invitation
          </h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Title:</strong> ${escapeHtml(title)}</p>
          <p><strong>Organization:</strong> ${escapeHtml(organization)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
          <p><strong>Postal Code:</strong> ${escapeHtml(postalCode)}</p>
          <p><strong>City:</strong> ${escapeHtml(city)}</p>
          <p><strong>Speak:</strong> ${speak ? 'Yes' : 'No'}</p>
          <p><strong>Knowledge partner:</strong> ${knowledgePartner ? 'Yes' : 'No'}</p>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    return { ok: false }
  }
  return { ok: true }
}
