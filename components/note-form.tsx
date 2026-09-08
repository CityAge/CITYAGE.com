'use client'

import { useState, type FormEvent } from 'react'

/** The one door. Every note on the site is this form, posting to /api/contact. */
export const SUBJECTS = [
  'sponsoring',
  'speaking',
  'The Northern Century',
  'The Next West',
  'the Studio',
  'press',
  'something else',
] as const
export type Subject = (typeof SUBJECTS)[number]

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function NoteForm({
  source,
  subject,
  tone = 'dark',
}: {
  /** The page the note came from, stored in the row's source column. */
  source: string
  /** Pre-selected subject, for the franchise pages. */
  subject?: Subject
  /** The contact page is dark; the franchise pages are cream. */
  tone?: 'dark' | 'light'
}) {
  const [status, setStatus] = useState<Status>('idle')
  const dark = tone === 'dark'
  const ink = dark ? 'text-[#F9F9F7]' : 'text-black'
  const rule = dark ? 'border-[#F9F9F7]/45' : 'border-black/45'
  const ph = dark ? 'placeholder:text-[#F9F9F7]/70' : 'placeholder:text-black/60'
  // The blanks: a hairline underline, no box, brass when focused.
  const blank = `inline-block max-w-full bg-transparent border-0 border-b ${rule} rounded-none px-1 py-0 font-serif font-normal not-italic ${ink} ${ph} placeholder:italic placeholder:font-light outline-none focus:border-[#C5A059] focus:border-b-2 transition-colors`
  const muted = dark ? 'text-[#F9F9F7]/70' : 'text-black/70'

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return
    const data = Object.fromEntries(new FormData(event.currentTarget).entries())
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return <p role="status" className={`font-serif text-[22px] leading-[1.75] ${ink}`}>Sent. Miro will read it.</p>
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Honeypot: real people never see or fill this. */}
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* One sentence, blanks inline; wraps to several lines on a phone. */}
      <p className={`font-serif text-[22px] leading-[1.75] ${ink}`}>
        I’m{' '}
        <input name="name" type="text" maxLength={200} required autoComplete="name" placeholder="name" aria-label="Your name" size={12} className={blank} />{' '}
        at{' '}
        <input name="organisation" type="text" autoComplete="organization" placeholder="organisation (optional)" aria-label="Your organisation (optional)" size={22} maxLength={200} className={blank} />
        {' '}in{' '}
        <input name="city" type="text" autoComplete="address-level2" placeholder="city (optional)" aria-label="Your city (optional)" size={16} maxLength={200} className={blank} />
        . Reach me at{' '}
        <input name="email" type="email" maxLength={320} required autoComplete="email" inputMode="email" placeholder="email" aria-label="Your email" size={18} className={blank} />
        . I’m writing about{' '}
        <select name="subject" required defaultValue={subject ?? ''} aria-label="Subject" className={`${blank} appearance-none cursor-pointer pr-5 bg-no-repeat bg-right ${dark ? "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23F9F9F7%22 stroke-width=%221.5%22><path d=%22M6 9l6 6 6-6%22/></svg>')]" : "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23000%22 stroke-width=%221.5%22><path d=%22M6 9l6 6 6-6%22/></svg>')]"}`}>
          <option value="" disabled>
            subject
          </option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s} className="text-black bg-[#F9F9F7]">
              {s}
            </option>
          ))}
        </select>
        .
      </p>

      <textarea
        name="message"
        required
        rows={6}
        maxLength={20000}
        placeholder="Say as much or as little as you like."
        aria-label="Your note"
        className={`block w-full bg-transparent border-0 border-b ${rule} rounded-none px-0 py-3 font-serif text-[18px] leading-[1.6] ${ink} ${ph} placeholder:italic placeholder:font-light outline-none focus:border-[#C5A059] focus:border-b-2 transition-colors resize-y`}
      />

      {status === 'error' ? (
        <p role="alert" className={`font-serif text-[16px] leading-[1.5] ${muted}`}>
          That didn’t send. Try again, or write to{' '}
          <a href="mailto:info@cityage.com" className="underline underline-offset-4 decoration-1 hover:text-[#C5A059]">
            info@cityage.com
          </a>
          .
        </p>
      ) : null}

      <div className="space-y-5">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-[#C5A059] text-black px-8 py-3 text-[11px] font-black tracking-[0.15em] uppercase hover:bg-black hover:text-[#C5A059] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A059] transition-colors disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending' : 'Send the note'}
        </button>
        <p className={`font-serif text-[15px] leading-[1.6] ${muted}`}>
          Or write directly:{' '}
          <a href="mailto:info@cityage.com" className="underline underline-offset-4 decoration-1 hover:text-[#C5A059]">
            info@cityage.com
          </a>
        </p>
      </div>
    </form>
  )
}
