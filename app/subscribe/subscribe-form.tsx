'use client'

import { useState, type FormEvent } from 'react'

type Status = 'idle' | 'submitting' | 'done' | 'error'

export function SubscribeForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting') return
    const data = Object.fromEntries(new FormData(event.currentTarget).entries())
    setStatus('submitting')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <p role="status" className="font-serif text-[22px] leading-[1.75] text-[#F9F9F7]">
        You’re on the list. We’ll email you when the CityAge newsletter launches.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="subscribe-email" className="block font-serif text-[18px] mb-2">
          Your email
        </label>
        <input
          id="subscribe-email"
          type="email"
          name="email"
          required
          maxLength={320}
          autoComplete="email"
          inputMode="email"
          placeholder="Email address"
          className="block w-full bg-transparent border-0 border-b border-[#F9F9F7]/45 px-0 py-2.5 font-serif text-[18px] text-[#F9F9F7] placeholder:text-[#F9F9F7]/70 outline-none focus:border-[#C5A059] focus:border-b-2"
        />
      </div>
      <div>
        <label htmlFor="subscribe-interests" className="block font-serif text-[18px] mb-2">
          What interests you? <span className="text-[#F9F9F7]/70">(optional)</span>
        </label>
        <textarea
          id="subscribe-interests"
          name="interests"
          rows={3}
          maxLength={2000}
          placeholder="A place, an issue or an idea you’d like us to explore."
          className="block w-full bg-transparent border-0 border-b border-[#F9F9F7]/45 px-0 py-3 font-serif text-[18px] leading-[1.6] text-[#F9F9F7] placeholder:text-[#F9F9F7]/70 placeholder:italic outline-none focus:border-[#C5A059] focus:border-b-2 resize-y"
        />
      </div>
      <p className="font-serif text-[15px] leading-[1.6] text-[#F9F9F7]/70">
        By subscribing, you ask to receive the CityAge newsletter by email.
      </p>
      {status === 'error' ? (
        <p role="alert" className="font-serif text-[16px] text-[#F9F9F7]">
          We couldn’t save your signup. Please try again. Your details are still here.
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="bg-[#C5A059] text-black px-8 py-3 text-[11px] font-black tracking-[0.15em] uppercase hover:bg-black hover:text-[#C5A059] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A059] transition-colors disabled:opacity-50"
      >
        {status === 'submitting' ? 'Saving' : 'Subscribe'}
      </button>
    </form>
  )
}
