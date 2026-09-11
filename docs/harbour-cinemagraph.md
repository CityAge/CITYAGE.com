# The Next West harbour cinemagraph

The approved still remains `public/next-west-dawn-with-tug.jpg`. This first
motion study keeps the tug stationary and introduces small water/reflection
movements, a shimmer along the existing wake, and faint exhaust. It does not
depict the tug travelling beneath the bridge. Camera, skyline and dawn stay fixed.

## Asset

- `public/next-west-harbour-loop-v1.mp4`
- 12 seconds, 24 fps, 1600 × 800, silent H.264 with fast-start metadata.
- Reproducible with `python scripts/render-harbour-loop.py` using Pillow,
  NumPy, SciPy and ffmpeg. The script also writes the seam measurements.
- All temporal functions wrap at 12 seconds. The first/end generated frames
  are identical; the last-to-first interval is an ordinary animation step.
- Procedural video compositing from the approved still, not new documentary
  footage or a generative-video output.

## Reusing the template

Set `heroVideo` to a same-origin MP4 URL in the event content. Keep `image`
and `imageAlt` populated: the image remains the accessible, immediate fallback.
Omit `heroVideo` to retain the existing still-image template.

The video source is not attached until the hero enters view and motion is
allowed. Reduced-motion and browser data-saving preferences retain the still.
Video pauses outside the viewport and when the browser tab is hidden. Manual
pause persists when scrolling away and back. Playback rejection keeps the
still and offers a play button; a failed video keeps the still without a broken
player. Day look retains the existing daytime image.

The new video replaces the older synthetic light overlays for this event.
The two people reels and the production publication gate are unchanged.

## Validation

See `harbour-loop-render.json` for generated-frame loop measurements. The
repository-wide TypeScript check also reports pre-existing issues in
`components/urban-planet-voices.tsx` and the Deno speaker-scraping function;
these are outside this change.
