'use client'

import { useState } from 'react'

interface ArchiveItem { id: string; title: string; published_at: string }

export function DubaiArchive({ items }: { items: ArchiveItem[] }) {
  const [show, setShow] = useState(false)
  if (items.length <= 1) return null

  return (
    <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', padding: '2.5rem 2rem' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: '1.5rem' }} onClick={() => setShow(!show)}>
          <h3 style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)' }}>Archive</h3>
          <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(0,0,0,0.25)' }}>{show ? '↑ Close' : `↓ ${items.length - 1} briefs`}</span>
        </div>
        {show && items.slice(1).map(b => (
          <a key={b.id} href={`/dispatches/${b.id}`}
            style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)', textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Georgia,serif', fontSize: '15px', color: 'rgba(0,0,0,0.6)' }}>
              {new Date(b.published_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'Asia/Dubai' })}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(0,0,0,0.2)' }}>Read →</span>
          </a>
        ))}
      </div>
    </div>
  )
}
