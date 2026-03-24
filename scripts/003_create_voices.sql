-- ============================================
-- CityAge Voices — contributors, columnists, guest writers
-- Powers the "Voices from The Urban Planet" strip
-- ============================================

CREATE TABLE IF NOT EXISTS public.voices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Person
  name TEXT NOT NULL,                        -- Full name
  title TEXT,                                -- Role / professional title
  organization TEXT,                         -- Company, institution, government
  city TEXT,                                 -- City they're based in
  photo_url TEXT,                            -- LinkedIn headshot or portrait URL
  linkedin_url TEXT,                         -- LinkedIn profile link
  
  -- Content they've written for CityAge
  headline TEXT,                             -- Title of their piece
  body TEXT,                                 -- Full article body (markdown)
  excerpt TEXT,                              -- Short summary for cards
  topic TEXT,                                -- Topic area (e.g. housing, AI, transit)
  
  -- Display
  is_pinned BOOLEAN DEFAULT FALSE,           -- Locked to position 1 (Miro Cernetig)
  sort_order INTEGER DEFAULT 100,            -- Manual ordering
  is_active BOOLEAN DEFAULT TRUE,            -- Show on site
  
  -- Metadata
  content_type TEXT DEFAULT 'column',        -- column, essay, qa_interview, linkedin_post
  pull_quote TEXT,                           -- Short quote for display
  source_urls TEXT[] DEFAULT '{}',           -- Original sources
  
  -- Timestamps
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.voices ENABLE ROW LEVEL SECURITY;

-- Public read access for active voices
CREATE POLICY "voices_public_read" ON public.voices 
  FOR SELECT USING (is_active = true);

-- Service role full access
CREATE POLICY "voices_service_write" ON public.voices
  FOR ALL USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS voices_active_idx ON public.voices(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS voices_pinned_idx ON public.voices(is_pinned DESC, sort_order ASC);
CREATE INDEX IF NOT EXISTS voices_published_idx ON public.voices(published_at DESC);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_voices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER voices_updated_at_trigger
  BEFORE UPDATE ON public.voices
  FOR EACH ROW
  EXECUTE FUNCTION update_voices_updated_at();
