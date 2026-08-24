'use client'

import { FormEvent, useState } from 'react'

export function SubscribeDoor() {
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
      <p className="font-serif italic text-[15px] text-black/50">
        You&rsquo;re in.
      </p>
    )
  }

  return (
    <>
      <p className="font-serif text-[15px] text-black/55 leading-[1.65] max-w-[28em]">
        Intelligence on infrastructure, defence, space, energy, and food systems. Delivered before markets open.
      </p>
      <form onSubmit={onSubmit} className="mt-5 flex flex-col sm:flex-row gap-2 max-w-[420px]">
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
          className="flex-1 bg-transparent border border-black/20 px-4 py-2.5 font-mono text-[11px] tracking-wider text-black placeholder-black/30 uppercase outline-none focus:border-black transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-black text-[#F9F9F7] px-6 py-2.5 font-mono text-[10px] font-black tracking-[0.2em] uppercase hover:bg-black/80 disabled:opacity-50 transition-colors"
        >
          {status === 'sending' ? 'Sending' : 'Subscribe'}
        </button>
      </form>
      {status === 'err' && (
        <p className="font-serif italic text-[13px] text-black/45 mt-3">
          Try again, or write info@cityage.com.
        </p>
      )}
    </>
  )
}
