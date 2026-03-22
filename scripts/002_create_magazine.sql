-- ============================================
-- Magazine table for The Urban Planet editorial
-- Separate from briefs (newsletter dispatches)
-- ============================================

-- Create vertical enum
DO $$ BEGIN
  CREATE TYPE magazine_vertical AS ENUM (
    'Power',
    'Money', 
    'Cities',
    'Frontiers',
    'Culture'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create status enum
DO $$ BEGIN
  CREATE TYPE magazine_status AS ENUM (
    'draft',
    'review',
    'published',
    'archived'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Main magazine articles table
CREATE TABLE IF NOT EXISTS public.magazine (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Editorial content
  headline TEXT NOT NULL,                    -- Short, punchy Monocle-style headline
  deck TEXT,                                 -- Subtitle / sub-headline
  body TEXT NOT NULL,                        -- Full article body (markdown)
  
  -- Classification
  vertical magazine_vertical NOT NULL,       -- Power, Money, Cities, Frontiers, Culture
  sub_vertical TEXT,                         -- e.g. Defence, Space, Mobility, Design
  tags TEXT[] DEFAULT '{}',                  -- Flexible tags: ['defence', 'nato', 'canada', 'procurement']
  
  -- Display
  image_url TEXT,                            -- Hero/thumbnail image URL
  image_caption TEXT,                        -- Photo credit / caption
  featured BOOLEAN DEFAULT FALSE,            -- Show in hero section
  
  -- Source tracking
  source_urls TEXT[] DEFAULT '{}',           -- URLs the article was sourced from
  source_summary TEXT,                       -- Brief note on sourcing for editorial reference
  
  -- Metadata
  author TEXT DEFAULT 'The Urban Planet',    -- Author / byline
  read_time INTEGER DEFAULT 5,              -- Estimated read time in minutes
  status magazine_status DEFAULT 'draft',
  
  -- AI processing
  model_used TEXT,                           -- Which AI model generated/processed this
  prompt_template TEXT,                      -- Which prompt template was used
  
  -- Timestamps
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.magazine ENABLE ROW LEVEL SECURITY;

-- Allow public read access for published articles
CREATE POLICY "magazine_public_read" ON public.magazine 
  FOR SELECT USING (status = 'published');

-- Allow service role full access (for scraper/admin)
CREATE POLICY "magazine_service_write" ON public.magazine
  FOR ALL USING (true) WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS magazine_vertical_idx ON public.magazine(vertical);
CREATE INDEX IF NOT EXISTS magazine_status_idx ON public.magazine(status);
CREATE INDEX IF NOT EXISTS magazine_published_idx ON public.magazine(published_at DESC);
CREATE INDEX IF NOT EXISTS magazine_featured_idx ON public.magazine(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS magazine_tags_idx ON public.magazine USING GIN(tags);
CREATE INDEX IF NOT EXISTS magazine_sub_vertical_idx ON public.magazine(sub_vertical);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_magazine_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER magazine_updated_at_trigger
  BEFORE UPDATE ON public.magazine
  FOR EACH ROW
  EXECUTE FUNCTION update_magazine_updated_at();
