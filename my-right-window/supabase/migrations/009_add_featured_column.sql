-- Add featured column to blogs table for homepage featured section
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Create index for faster featured blog queries
CREATE INDEX IF NOT EXISTS idx_blogs_featured ON blogs(featured);

-- Create index for combined published and featured queries
CREATE INDEX IF NOT EXISTS idx_blogs_published_featured ON blogs(published, featured);

-- Comment for documentation
COMMENT ON COLUMN blogs.featured IS 'Marks a blog as featured to display on the homepage Featured Insights section';
