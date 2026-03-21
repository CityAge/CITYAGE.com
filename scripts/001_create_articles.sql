-- Create articles table for CityAge
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  headline TEXT NOT NULL,
  deck TEXT,
  body TEXT NOT NULL,
  author_name TEXT,
  author_title TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access (articles are public content)
CREATE POLICY "articles_public_read" ON public.articles 
  FOR SELECT USING (true);

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS articles_slug_idx ON public.articles(slug);
CREATE INDEX IF NOT EXISTS articles_category_idx ON public.articles(category);
CREATE INDEX IF NOT EXISTS articles_featured_idx ON public.articles(featured);
