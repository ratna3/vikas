-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  images JSONB DEFAULT '[]',
  pdf_url TEXT,
  pdf_name TEXT,
  slug TEXT UNIQUE NOT NULL
);

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public blogs are viewable by everyone" ON blogs;
DROP POLICY IF EXISTS "Admins can do everything" ON blogs;

-- RLS Policies

-- Public read access for published blogs
CREATE POLICY "Public blogs are viewable by everyone" ON blogs
  FOR SELECT USING (published = true);

-- Admin full access (using user_profiles role check)
CREATE POLICY "Admins can do everything" ON blogs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Enable Realtime for blogs
ALTER PUBLICATION supabase_realtime ADD TABLE blogs;

-- Create storage buckets for images and PDFs (run these in Supabase dashboard if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('pdfs', 'pdfs', true);
