'use client'

import { useState } from 'react'

type Film = {
  id: string
  title: string
  type: string
  vimeoId: string | null
  still: string
  thumb: string
}

const FILMS: Film[] = [
  {
    id: 'facing-saddam',
    title: 'Facing Saddam',
    type: 'Documentary Feature',
    vimeoId: null,
    still: '/facing-saddam-still.png',
    thumb: '/facing-saddam-thumb.png',
  },
  {
    id: 'best-day-ever',
    title: 'Best Day Ever',
    type: 'Short Film · Doug Coupland',
    vimeoId: '393076418',
    still: '/best-day-ever-thumb.jpg',
    thumb: '/best-day-ever-thumb.jpg',
  },
  {
    id: 'sketch-in-the-city',
    title: 'Sketch In The City',
    type: 'Short Film',
    vimeoId: '241956203',
    still: '/sketch-in-the-city-thumb.jpg',
    thumb: '/sketch-in-the-city-thumb.jpg',
  },
  {
    id: 'west-coast-modernism',
    title: 'West Coast Modernism',
    type: 'Documentary Short',
    vimeoId: '287190902',
    still: '/grosvenor-thumb.jpg',
    thumb: '/grosvenor-thumb.jpg',
  },
]

export function StudioHouse() {
  const [active, setActive] = useState<Film>(FILMS[0])

  return (
    <section id="studio" className="studio-house">
      <div className="studio-house-inner">
        <div className="studio-house-rule">
          <h3>Studio</h3>
          <span>Watch in the dark</span>
        </div>

        <div className="studio-house-stage">
          {active.vimeoId ? (
            <iframe
              key={active.id}
              src={`https://player.vimeo.com/video/${active.vimeoId}?color=C5A059&title=0&byline=0&portrait=0`}
              title={active.title}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={active.still} alt={active.title} />
          )}
        </div>

        <p className="studio-house-now">
          <span>{active.type}</span>
          {active.title}
        </p>

        <div className="studio-house-thumbs">
          {FILMS.map((film) => (
            <button
              key={film.id}
              type="button"
              onClick={() => setActive(film)}
              className={film.id === active.id ? 'is-active' : undefined}
              aria-pressed={film.id === active.id}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={film.thumb} alt="" />
              <span>{film.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
