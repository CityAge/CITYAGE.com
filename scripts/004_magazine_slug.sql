-- ============================================
-- Optional human-readable URL for a magazine story.
-- /magazine/[id] accepts either the uuid or this slug.
-- Applied to urban-planet-brain on 2026-09-02 (migration magazine_slug).
-- ============================================

ALTER TABLE public.magazine ADD COLUMN IF NOT EXISTS slug TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS magazine_slug_idx ON public.magazine(slug) WHERE slug IS NOT NULL;
