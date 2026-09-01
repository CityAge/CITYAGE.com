import { createSign } from 'crypto'

const SPREADSHEET_ID = '1DqUHZ1zeEWui3v9lzO03ymCBHkcI2Ig_kIxFmYOw3Q4'

const HEADER = [
  'Submitted (PT)',
  'First Name',
  'Last Name',
  'Title',
  'Organization',
  'Email',
  'Postal Code',
  'City',
  'Attend',
  'Speak',
  'Knowledge partner',
  'Comments',
] as const

type ServiceAccount = {
  client_email?: string
  private_key?: string
}

function readServiceAccount(): ServiceAccount | null {
  const raw =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_SHEETS ||
    process.env.GOOGLE_SHEETS_CREDENTIALS ||
    process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT

  if (raw) {
    try {
      return JSON.parse(raw) as ServiceAccount
    } catch {
      try {
        return JSON.parse(Buffer.from(raw, 'base64').toString('utf8')) as ServiceAccount
      } catch {
        return null
      }
    }
  }

  const email = process.env.GOOGLE_CLIENT_EMAIL
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  if (email && key) return { client_email: email, private_key: key }
  return null
}

function base64url(value: string | Buffer) {
  const buf = typeof value === 'string' ? Buffer.from(value) : value
  return buf.toString('base64url')
}

async function accessToken(account: ServiceAccount): Promise<string | null> {
  if (!account.client_email || !account.private_key) return null
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claim = base64url(
    JSON.stringify({
      iss: account.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  )
  const signer = createSign('RSA-SHA256')
  signer.update(`${header}.${claim}`)
  const jwt = `${header}.${claim}.${signer.sign(account.private_key, 'base64url')}`

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })
  if (!res.ok) return null
  const body = (await res.json()) as { access_token?: string }
  return body.access_token || null
}

async function firstSheetTitle(token: string): Promise<string | null> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties.title`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  if (!res.ok) return null
  const body = (await res.json()) as { sheets?: Array<{ properties?: { title?: string } }> }
  return body.sheets?.[0]?.properties?.title || null
}

async function readRow(token: string, range: string): Promise<string[] | null> {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  if (!res.ok) return null
  const body = (await res.json()) as { values?: string[][] }
  return body.values?.[0] || []
}

async function appendRow(token: string, range: string, row: string[]) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [row] }),
    },
  )
  return res.ok
}

export async function appendNextWestRow(row: string[]): Promise<void> {
  const account = readServiceAccount()
  if (!account) return
  const token = await accessToken(account)
  if (!token) return
  const title = await firstSheetTitle(token)
  if (!title) return

  const headerRange = `'${title}'!A1:L1`
  const existing = await readRow(token, headerRange)
  if (!existing || existing.length === 0) {
    const wrote = await appendRow(token, headerRange, [...HEADER])
    if (!wrote) return
  }

  await appendRow(token, `'${title}'!A:L`, row)
}
