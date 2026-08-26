# CityAge Magazine

The primary intelligence source for global urban leadership.  
Next.js 16 App Router + Supabase + Tailwind CSS 4. Preview on Vercel.

## Vercel environment variables

The door reads the live `speakers` table (project `urban-planet-brain`, id `rniqmxpmtqmnwqtawlnz`). Set these on the Vercel project (Preview and Production). **Anon key only. Never add `service_role`.**

- `NEXT_PUBLIC_SUPABASE_URL` — `https://rniqmxpmtqmnwqtawlnz.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the project's public anon key

If those are missing, the masthead still paints immediately and the reel falls back to a few real headshots already in `/public`. The rest of the faces stream from Supabase when the anon key is present.

## Local Dev

```bash
npm install
npm run dev
```
