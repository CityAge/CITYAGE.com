'use client'

import { useState } from 'react'

export function DubaiAskBar() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [answering, setAnswering] = useState(false)

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || answering) return
    setAnswering(true)
    setAnswer('')
    try {
      const res = await fetch('/api/dubai-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      const data = await res.json()
      setAnswer(data.answer || 'No answer found.')
    } catch { setAnswer('Something went wrong. Try again.') }
    setAnswering(false)
  }

  return (
    <div style={{ background: '#fff', borderBottom: '2px solid #000', padding: '1rem 2rem' }}>
      <form style={{ maxWidth: '680px', margin: '0 auto', display: 'flex' }} onSubmit={handleAsk}>
        <input type="text"
          style={{ flex: 1, fontFamily: 'monospace', fontSize: '12px', padding: '0.8rem 1rem', border: '1px solid rgba(0,0,0,0.15)', borderRight: 'none', background: '#F8F6F1', outline: 'none' }}
          placeholder="Ask us anything about Dubai — real estate, restaurants, investment, lifestyle..."
          value={question} onChange={e => setQuestion(e.target.value)} />
        <button type="submit" disabled={answering}
          style={{ fontFamily: 'monospace', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0.8rem 1.5rem', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {answering ? '...' : 'Ask'}
        </button>
      </form>
      {answer && (
        <div style={{ maxWidth: '680px', margin: '1rem auto 0', fontFamily: 'Georgia,serif', fontSize: '15px', lineHeight: 1.7, color: 'rgba(0,0,0,0.7)', padding: '1rem 1.25rem', background: '#f0ede6', borderLeft: '3px solid #C5A059' }}
          dangerouslySetInnerHTML={{ __html: answer.replace(/\n/g, '<br/>') }} />
      )}
    </div>
  )
}
