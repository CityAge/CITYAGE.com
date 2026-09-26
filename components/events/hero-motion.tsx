'use client'

import { useEffect, useRef, useState } from 'react'

/** Optional, decorative video over an always-present, accessible poster image. */
export function HeroMotion({ src }: { src: string }) {
  const container = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const manuallyPaused = useRef(false)
  const [allowed, setAllowed] = useState(false)
  const [visible, setVisible] = useState(false)
  const [entered, setEntered] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [hasFrame, setHasFrame] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const connection = (navigator as Navigator & {
      connection?: EventTarget & { saveData?: boolean }
    }).connection
    const updatePreference = () => setAllowed(!motion.matches && !connection?.saveData)
    const updateVisibility = () => setPageVisible(document.visibilityState === 'visible')
    updatePreference()
    updateVisibility()
    motion.addEventListener('change', updatePreference)
    connection?.addEventListener('change', updatePreference)
    document.addEventListener('visibilitychange', updateVisibility)
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
      if (entry.isIntersecting) setEntered(true)
    }, { threshold: 0.05 })
    if (container.current) observer.observe(container.current)
    return () => {
      observer.disconnect()
      motion.removeEventListener('change', updatePreference)
      connection?.removeEventListener('change', updatePreference)
      document.removeEventListener('visibilitychange', updateVisibility)
    }
  }, [])

  useEffect(() => {
    const el = video.current
    if (!el) return
    if (allowed && entered && visible && pageVisible && !failed && !manuallyPaused.current) {
      void el.play().catch(() => setPlaying(false))
    } else {
      el.pause()
    }
  }, [allowed, entered, visible, pageVisible, failed])

  function togglePlayback() {
    const el = video.current
    if (!el) return
    if (el.paused) {
      manuallyPaused.current = false
      void el.play().catch(() => setPlaying(false))
    } else {
      manuallyPaused.current = true
      el.pause()
    }
  }

  return <div ref={container} className="nw-hero-motion" data-visible={allowed && hasFrame && !failed}>
    <video
      ref={video}
      className="nw-hero-video"
      src={allowed && entered && !failed ? src : undefined}
      width={1600}
      height={800}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      onPlaying={() => { setHasFrame(true); setPlaying(true) }}
      onPause={() => setPlaying(false)}
      onError={() => { setFailed(true); setPlaying(false); setHasFrame(false) }}
    />
    {allowed && entered && !failed && <button
      type="button"
      className="nw-hero-motion-control"
      onClick={togglePlayback}
      aria-label={playing ? 'Pause harbour animation' : 'Play harbour animation'}
      aria-pressed={!playing}
    >{playing ? 'Pause scene' : 'Play scene'}</button>}
  </div>
}
