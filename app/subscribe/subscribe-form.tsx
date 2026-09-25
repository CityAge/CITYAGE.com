'use client'

import { useState, type FormEvent } from 'react'

type Status = 'idle' | 'submitting' | 'done' | 'pending' | 'error'

export function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const body = await res.json()
      setStatus(res.ok ? (body.destination === 'beehiiv' ? 'done' : 'pending') : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done' || status === 'pending') {
    return (
      <p className="font-serif text-[18px] md:text-[21px] leading-[1.75] text-black">
        {status === 'done' ? 'You have been added to the CityAge list.' : 'We received your subscription request.'}
      </p>
    )
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row sm:items-stretch gap-3">
        <label className="sr-only" htmlFor="subscribe-email">
          Email
        </label>
        <input
          id="subscribe-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="flex-1 min-w-0 bg-transparent border-0 border-b border-black px-0 py-2.5 font-serif text-[18px] text-black placeholder:text-black/35 outline-none focus:border-[#C5A059]"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-[#C5A059] text-black px-8 py-2.5 text-[11px] font-black tracking-[0.15em] uppercase hover:bg-black hover:text-[#C5A059] transition-colors disabled:opacity-50"
        >
          Subscribe
        </button>
      </form>
      {status === 'error' ? (
        <p className="font-serif text-[16px] text-black/60 mt-4">Try again.</p>
      ) : null}
    </div>
  )
}
