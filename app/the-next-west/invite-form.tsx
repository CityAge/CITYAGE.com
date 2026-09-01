'use client'

import { useState, type FormEvent } from 'react'
import { submitNextWestInvite } from './actions'

type Status = 'idle' | 'submitting' | 'done' | 'error'

const FIELD =
  'w-full bg-transparent border-0 border-b border-black px-0 py-2.5 font-serif text-[18px] text-black placeholder:text-black/35 outline-none focus:border-[#C5A059]'

const LABEL = 'font-mono text-[10px] font-bold tracking-[0.16em] uppercase text-black/55'

export function InviteForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    try {
      const result = await submitNextWestInvite(new FormData(event.currentTarget))
      setStatus(result.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <p className="font-serif text-[18px] md:text-[21px] leading-[1.75] text-black">
        Received. We will write.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        <label className="block">
          <span className={LABEL}>First Name</span>
          <input className={FIELD} name="firstName" required autoComplete="given-name" />
        </label>
        <label className="block">
          <span className={LABEL}>Last Name</span>
          <input className={FIELD} name="lastName" required autoComplete="family-name" />
        </label>
        <label className="block">
          <span className={LABEL}>Title</span>
          <input className={FIELD} name="title" required autoComplete="organization-title" />
        </label>
        <label className="block">
          <span className={LABEL}>Organization</span>
          <input className={FIELD} name="organization" required autoComplete="organization" />
        </label>
        <label className="block">
          <span className={LABEL}>Email</span>
          <input className={FIELD} name="email" type="email" required autoComplete="email" inputMode="email" />
        </label>
        <label className="block">
          <span className={LABEL}>Postal Code</span>
          <input className={FIELD} name="postalCode" required autoComplete="postal-code" />
        </label>
        <label className="block sm:col-span-2">
          <span className={LABEL}>City</span>
          <input className={FIELD} name="city" required autoComplete="address-level2" />
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 pt-2">
        <label className="flex items-center gap-3 font-serif text-[17px] text-black">
          <input
            type="checkbox"
            name="speak"
            className="size-4 accent-[#C5A059] border-black"
          />
          Speak.
        </label>
        <label className="flex items-center gap-3 font-serif text-[17px] text-black">
          <input
            type="checkbox"
            name="knowledgePartner"
            className="size-4 accent-[#C5A059] border-black"
          />
          Knowledge partner.
        </label>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="bg-[#C5A059] text-black px-8 py-2.5 text-[11px] font-black tracking-[0.15em] uppercase hover:bg-black hover:text-[#C5A059] transition-colors disabled:opacity-50"
      >
        Apply for an invitation
      </button>

      {status === 'error' ? (
        <p className="font-serif text-[16px] text-black/60">Try again.</p>
      ) : null}
    </form>
  )
}
