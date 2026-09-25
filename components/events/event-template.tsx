'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import { HeroMotion } from './hero-motion'
import './event-template.css'

export type EventPerson = { name: string; role: string; organisation?: string; image?: string }
export type EventContent = {
  title: string; tagline: string; location: string; timing: string; thesis: string;
  image: string; imageAlt: string; dayImage?: string; tugImage?: string; heroVideo?: string;
  themes: { title: string; description: string }[];
  speakers: EventPerson[]; attendees: EventPerson[];
  agenda: { time: string; title: string; description?: string }[];
}

function PeopleReel({ title, people, kind }: { title: string; people: EventPerson[]; kind: 'speakers' | 'attendees' }) {
  const [paused, setPaused] = useState(false)
  const illustrative = people.length === 0
  const cards = illustrative ? ['Business', 'Government', 'Research', 'Investment', 'Innovation', 'Community'].map(role => ({ name: 'To be announced', role } as EventPerson)) : people
  const moving = cards.length >= 5
  return <section className="nw-section nw-people" aria-labelledby={`nw-${kind}`}>
    <div className="nw-section-head"><div><h2 id={`nw-${kind}`}>{title}</h2><p className="nw-note">{illustrative ? `Illustrative reel · ${kind === 'speakers' ? 'Speakers' : 'Attendees'} to be announced` : kind === 'speakers' ? 'Meet the speakers.' : 'Meet the people joining the conversation.'}</p></div>
      {moving && <button type="button" className="nw-control nw-motion-control" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? 'Play reel' : 'Pause reel'}</button>}
    </div>
    <div className="nw-reel" tabIndex={0} aria-label={`${title}. Scroll to explore; motion pauses on hover or focus.`} data-paused={paused} data-moving={moving}>
      <div className="nw-track">
        {[0, ...(moving ? [1] : [])].map(copy => <ul className="nw-person-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {cards.map((person, i) => <li className="nw-person" key={`${person.name}-${i}`}>
            {person.image ? <img src={person.image} alt="" width={220} height={245} loading="lazy" /> : <div className="nw-person-placeholder"><span>{illustrative ? 'THE NEXT WEST' : person.organisation || 'CITYAGE'}</span><strong>{person.role}</strong><span>{illustrative ? 'Participant to be announced' : person.name}</span></div>}
            <h3>{person.name}</h3><p>{person.role}{person.organisation ? ` · ${person.organisation}` : ''}</p>
          </li>)}
        </ul>)}
      </div>
    </div>
  </section>
}

// Image-relative light positions. Only these small points shimmer; the photograph stays still.
const LIGHTS = [[21.1,60.8],[36.4,64.7],[52,67.5],[70,59],[80,48]]
export function EventTemplate({ event, enquiry, preview = false }: { event: EventContent; enquiry: ReactNode; preview?: boolean }) {
  const [day, setDay] = useState(false)
  const [still, setStill] = useState(false)
  return <main className={`nw-event ${day ? 'nw-day' : ''}`}>
    {preview && <div className="nw-preview"><span>Event preview · Details and participants to be confirmed</span><div><button className="nw-control" onClick={() => setDay(!day)} type="button" aria-pressed={day}>{day ? 'Night look' : 'Day look'}</button>{!event.heroVideo && <button className="nw-control nw-motion-control" onClick={() => setStill(!still)} type="button" aria-pressed={still}>{still ? 'Play scene' : 'Pause scene'}</button>}</div></div>}
    <header className="nw-opening">
      <div className="nw-heading"><p className="nw-kicker">A CityAge event</p><h1>{event.title}</h1><p className="nw-tagline">{event.tagline}</p><p className="nw-location">{event.location} <span>·</span> {event.timing}</p></div>
      <figure className="nw-image" data-still={still}><img src={day && event.dayImage ? event.dayImage : event.image} alt={event.imageAlt} width={1536} height={768} fetchPriority="high" />
        {!day && event.heroVideo && <HeroMotion src={event.heroVideo} />}
        {!day && !event.heroVideo && event.tugImage && <><div className="nw-tug-voyage" aria-hidden="true"><img className="nw-tug" src={event.tugImage} alt="" width={1536} height={1024} /></div><img className="nw-bridge-foreground" src={event.image} alt="" aria-hidden="true" width={1774} height={887} /></>}
        {!day && !event.heroVideo && <><span className="nw-sails-light" aria-hidden="true" /><span className="nw-beacon" aria-hidden="true" /></>}
        {!day && !event.heroVideo && <div className="nw-lights" aria-hidden="true">{LIGHTS.map(([x,y], i) => <i key={i} style={{left:`${x}%`, top:`${y}%`, '--delay':`${i * -1.7}s`} as CSSProperties} />)}</div>}
      </figure>
      <div className="nw-thesis"><p>{event.thesis}</p><a href="#invite" className="nw-button">Register your interest</a></div>
    </header>
    <section className="nw-section nw-themes" aria-labelledby="nw-themes"><h2 id="nw-themes">The themes</h2><div className="nw-theme-grid">{event.themes.map((theme,i) => <div key={theme.title}><span className="nw-number">{String(i+1).padStart(2,'0')}</span><h3>{theme.title}</h3><p>{theme.description}</p></div>)}</div></section>
    <PeopleReel title="Who’s speaking" people={event.speakers} kind="speakers" />
    <section className="nw-agenda" aria-labelledby="nw-agenda"><div className="nw-section"><div className="nw-section-head"><h2 id="nw-agenda">The agenda</h2>{preview && <p className="nw-note">Illustrative programme</p>}</div><ol>{event.agenda.map((slot,i) => <li key={i}><span className="nw-time">{slot.time}</span><div><h3>{slot.title}</h3>{slot.description && <p>{slot.description}</p>}</div></li>)}</ol></div></section>
    <PeopleReel title="Who’s in the room" people={event.attendees} kind="attendees" />
    <section className="nw-invite nw-section" id="invite"><h2>Help shape what comes next.</h2><p>Register your interest in The Next West.</p><div className="nw-form">{enquiry}</div></section>
  </main>
}
