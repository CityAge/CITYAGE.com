'use client'

import { FormEvent, useState } from 'react'

export function InfluenceLetterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    if (form.get('website')) {
      setStatus('ok')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website: '' }),
      })
      setStatus(res.ok ? 'ok' : 'err')
    } catch {
      setStatus('err')
    }
  }

  if (status === 'ok') {
    return (
      <p className="font-serif italic text-white/60 text-[13px] leading-relaxed">
        You&rsquo;re on the letter.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <input
        type="email"
        name="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full bg-white/10 border border-white/20 px-4 py-2.5 font-mono text-[11px] tracking-wider text-white placeholder-white/30 uppercase outline-none focus:border-[#C5A059] transition-colors mb-2"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-[#C5A059] text-black py-2.5 font-mono text-[10px] font-black tracking-[0.2em] uppercase hover:bg-white transition-colors disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending' : 'Subscribe Free'}
      </button>
      {status === 'err' && (
        <p className="font-serif italic text-white/45 text-[12px] mt-3">
          Try again, or write info@cityage.com.
        </p>
      )}
    </form>
  )
}
