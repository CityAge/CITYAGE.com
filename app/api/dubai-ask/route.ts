import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { question } = await req.json()
  if (!question?.trim()) return NextResponse.json({ answer: 'Please ask a question.' })

  try {
    const supabase = await createClient()

    // Search recent Dubai briefs for context
    const { data: briefs } = await supabase
      .from('briefs')
      .select('title, body, published_at')
      .eq('vertical', 'Daybreak Dubai')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(5)

    const context = (briefs || []).map(b =>
      `--- ${b.title} ---\n${(b.body || '').substring(0, 2000)}`
    ).join('\n\n')

    // Call Claude API
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: `You are the intelligence desk at Daybreak Dubai — a premium daily letter covering Dubai's luxury economy, real estate, restaurants, hotels, wellness, and investment landscape.

Answer the reader's question using the recent brief context below. Be precise, specific, and warm. If the answer isn't in the briefs, say so briefly and answer from your knowledge of Dubai. Keep answers under 150 words. No bullet points — write in prose.

RECENT BRIEFS:\n${context}`,
        messages: [{ role: 'user', content: question }]
      })
    })

    const data = await res.json()
    const answer = data.content?.[0]?.text || 'No answer found.'
    return NextResponse.json({ answer })
  } catch (e) {
    return NextResponse.json({ answer: 'Something went wrong. Try again.' }, { status: 500 })
  }
}
