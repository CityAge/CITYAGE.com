'use client'

import { useState, type FormEvent } from 'react'

const ABOUT = [
  'Sponsoring a room',
  'Speaking',
  'The Northern Century',
  'The Next West',
  'Studio: a film',
  'Studio: brand strategy',
  'Studio: a campaign',
  'Media',
  'Something else',
] as const

type Status = 'idle' | 'sending' | 'sent' | 'error'

const LABEL = 'block font-serif text-[12px] leading-none uppercase tracking-[0.08em] text-[#9A9A9A] mb-2'
const FIELD =
  'block w-full bg-transparent border-0 border-b border-[#444444] rounded-none px-0 py-2.5 font-serif text-[17px] leading-[1.4] text-[#F9F9F7] placeholder:text-[#F9F9F7]/30 outline-none focus:border-[#C5A059] transition-colors'

function Field({ id, label, required = true, children }: { id: string; label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
        {required ? null : <span className="normal-case tracking-normal text-[#9A9A9A]/70"> · optional</span>}
      </label>
      {children}
    </div>
  )
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return <p className="type-body text-[#F9F9F7]">Received. We read everything.</p>
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate={false}>
      {/* Honeypot: real people never see or fill this. */}
      <div className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
        <Field id="firstName" label="First name">
          <input id="firstName" name="firstName" type="text" required autoComplete="given-name" className={FIELD} />
        </Field>
        <Field id="lastName" label="Last name">
          <input id="lastName" name="lastName" type="text" required autoComplete="family-name" className={FIELD} />
        </Field>
      </div>

      <Field id="email" label="Email">
        <input id="email" name="email" type="email" required autoComplete="email" className={FIELD} />
      </Field>

      <Field id="organisation" label="Organisation">
        <input id="organisation" name="organisation" type="text" required autoComplete="organization" className={FIELD} />
      </Field>

      <Field id="city" label="City" required={false}>
        <input id="city" name="city" type="text" autoComplete="address-level2" className={FIELD} />
      </Field>

      <Field id="about" label="What's this about?">
        <div className="relative">
          <select id="about" name="about" required defaultValue="" className={`${FIELD} appearance-none pr-8 cursor-pointer`}>
            <option value="" disabled>
              Choose one
            </option>
            {ABOUT.map((option) => (
              <option key={option} value={option} className="text-black">
                {option}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A9A]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </Field>

      <Field id="message" label="Message">
        <textarea id="message" name="message" required rows={5} className={`${FIELD} resize-y`} />
      </Field>

      {status === 'error' ? (
        <p className="type-body text-[#C5A059]">Something went wrong. Try again, or write to info@cityage.com.</p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="block w-full bg-[#C5A059] text-black font-serif text-[12px] leading-none font-black uppercase tracking-[0.12em] py-3.5 hover:bg-white transition-colors disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending' : 'Send'}
      </button>
    </form>
  )
}
