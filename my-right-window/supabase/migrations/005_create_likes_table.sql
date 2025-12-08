-- Create likes table for blog engagement
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate likes from same user on same blog
  UNIQUE(blog_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_likes_blog_id ON likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);

-- Enable Row Level Security
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view likes" ON likes;
DROP POLICY IF EXISTS "Authenticated users can insert their own likes" ON likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON likes;

-- RLS Policies

-- Anyone can view likes (for counting)
CREATE POLICY "Anyone can view likes" ON likes
  FOR SELECT USING (true);

-- Authenticated users can insert their own likes
CREATE POLICY "Authenticated users can insert their own likes" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can delete their own likes" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- ============ RPC Functions ============

-- Function to get like count for a blog
CREATE OR REPLACE FUNCTION get_like_count(p_blog_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM likes WHERE blog_id = p_blog_id);
END;
$$;

-- Function to check if user has liked a blog
CREATE OR REPLACE FUNCTION has_user_liked(p_blog_id UUID, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM likes 
    WHERE blog_id = p_blog_id AND user_id = p_user_id
  );
END;
$$;

-- Function to toggle like (add or remove)
CREATE OR REPLACE FUNCTION toggle_like(p_blog_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_liked BOOLEAN;
  v_count INTEGER;
BEGIN
  -- Get the current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to like';
  END IF;
  
  -- Check if already liked
  IF EXISTS (SELECT 1 FROM likes WHERE blog_id = p_blog_id AND user_id = v_user_id) THEN
    -- Unlike: Remove the like
    DELETE FROM likes WHERE blog_id = p_blog_id AND user_id = v_user_id;
    v_liked := FALSE;
  ELSE
    -- Like: Add the like
    INSERT INTO likes (blog_id, user_id) VALUES (p_blog_id, v_user_id);
    v_liked := TRUE;
  END IF;
  
  -- Get updated count
  SELECT COUNT(*) INTO v_count FROM likes WHERE blog_id = p_blog_id;
  
  RETURN json_build_object('liked', v_liked, 'count', v_count);
END;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_like_count(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION has_user_liked(UUID, UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION toggle_like(UUID) TO authenticated;
