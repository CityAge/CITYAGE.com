import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let body: { email?: string; website?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  if (body.website) {
    return NextResponse.json({ ok: true })
  }

  const email = body.email?.trim().toLowerCase() ?? ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
