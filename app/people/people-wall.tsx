'use client'

import { useEffect, useMemo, useState } from 'react'
import { ReelStrip } from '@/components/speakers-reel-strip'
import { fetchSpeakerFaces, shuffle, type SpeakerFace } from '@/lib/speakers'
import './people.css'

const REEL_DURATIONS = ['95s', '115s', '105s', '125s'] as const
const REEL_DIRS = ['left', 'right', 'left', 'right'] as const

export function PeopleWall() {
  const [speakers, setSpeakers] = useState<SpeakerFace[]>([])
  const [rows, setRows] = useState<SpeakerFace[][]>([[], [], [], []])
  const [query, setQuery] = useState('')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchSpeakerFaces()
      .then((all) => {
        if (cancelled) return
        setSpeakers(all)
        const shuffled = shuffle(all)
        const chunk = Math.ceil(shuffled.length / 4) || 1
        setRows([
          shuffled.slice(0, chunk),
          shuffled.slice(chunk, chunk * 2),
          shuffled.slice(chunk * 2, chunk * 3),
          shuffled.slice(chunk * 3),
        ])
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return speakers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.title || '').toLowerCase().includes(q) ||
        (s.organisation || '').toLowerCase().includes(q),
    )
  }, [query, speakers])

  const searching = query.trim().length > 0

  return (
    <div id="people-wall" className={searching ? 'is-searching' : undefined}>
      <div className="reel-stack" aria-label="The CityAge Contributors">
        {failed ? (
          <div className="people-loading">Unable to load speakers</div>
        ) : speakers.length === 0 ? (
          <div className="people-loading">Loading</div>
        ) : (
          rows.map((faces, i) => (
            <div key={i} className={`reel-section reel-${i + 1}`}>
              <ReelStrip faces={faces} direction={REEL_DIRS[i]} duration={REEL_DURATIONS[i]} />
            </div>
          ))
        )}
      </div>

      <section className="people-search">
        <span className="people-search-label">Search the network</span>
        <div className="people-search-wrap">
          <input
            className="people-search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, title, or organisation…"
            autoComplete="off"
          />
          {searching && (
            <button type="button" className="people-search-clear" onClick={() => setQuery('')}>
              Clear ×
            </button>
          )}
        </div>
      </section>

      {searching && (
        <section className="people-results">
          <div className="people-results-count">
            <span>{matches.length}</span> result{matches.length === 1 ? '' : 's'} for “{query.trim()}”
          </div>
          {matches.length === 0 ? (
            <div className="people-empty">No matches found.</div>
          ) : (
            <div className="people-results-grid">
              {matches.map((s) => (
                <a
                  key={s.id}
                  className="people-result"
                  href={s.linkedin_url || undefined}
                  target={s.linkedin_url ? '_blank' : undefined}
                  rel={s.linkedin_url ? 'noopener noreferrer' : undefined}
                >
                  <div className="people-result-thumb">
                    {s.headshot_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.headshot_url} alt="" />
                    ) : null}
                  </div>
                  <div>
                    <div className="people-result-name">{s.name}</div>
                    {s.title && <div className="people-result-title">{s.title}</div>}
                    {s.organisation && <div className="people-result-org">{s.organisation}</div>}
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
