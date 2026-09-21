# Image delivery

- Never pass a Supabase `/storage/v1/render/image/` URL through Next.js/Vercel image optimization.
- Use plain `<img>` elements with one direct thumbnail `src` for speaker tiles. No optimizer preloads, generated srcsets, or oversized fallback.
- Use `components/site-image.tsx` for other Next Image usage; it bypasses optimization for already-transformed Supabase URLs.
- Speaker ordering uses `stableSpeakerShuffle` with the fixed `cityage-stage-v1` seed. Do not use runtime randomness or time-dependent seeds for speaker reels.
- Keep below-fold speaker images lazy-loaded and preserve the existing tile dimensions, crop, filters, and hover styles.
