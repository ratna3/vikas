-- Create comments table for blog discussions
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_comments_blog_id ON comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

-- RLS Policies

-- Anyone can view comments
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

-- Authenticated users can insert comments
CREATE POLICY "Authenticated users can insert comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- ============ RPC Functions ============

-- Function to get comments for a blog with user profiles
CREATE OR REPLACE FUNCTION get_blog_comments(p_blog_id UUID)
RETURNS TABLE (
  id UUID,
  blog_id UUID,
  user_id UUID,
  content TEXT,
  parent_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  full_name TEXT,
  avatar_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.blog_id,
    c.user_id,
    c.content,
    c.parent_id,
    c.created_at,
    c.updated_at,
    COALESCE(up.full_name, 'Anonymous') as full_name,
    up.avatar_url
  FROM comments c
  LEFT JOIN user_profiles up ON c.user_id = up.id
  WHERE c.blog_id = p_blog_id
  ORDER BY c.created_at ASC;
END;
$$;

-- Function to add a comment
CREATE OR REPLACE FUNCTION add_blog_comment(p_blog_id UUID, p_content TEXT, p_parent_id UUID DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_comment comments;
  v_profile user_profiles;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('error', 'User must be authenticated to comment');
  END IF;
  
  INSERT INTO comments (blog_id, user_id, content, parent_id)
  VALUES (p_blog_id, v_user_id, p_content, p_parent_id)
  RETURNING * INTO v_comment;
  
  SELECT * INTO v_profile FROM user_profiles WHERE id = v_user_id;
  
  RETURN json_build_object(
    'id', v_comment.id,
    'blog_id', v_comment.blog_id,
    'user_id', v_comment.user_id,
    'content', v_comment.content,
    'parent_id', v_comment.parent_id,
    'created_at', v_comment.created_at,
    'user_profiles', json_build_object(
      'full_name', COALESCE(v_profile.full_name, 'Anonymous'),
      'avatar_url', v_profile.avatar_url
    )
  );
END;
$$;

-- Function to delete a comment
CREATE OR REPLACE FUNCTION delete_blog_comment(p_comment_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_comment_owner UUID;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object('error', 'User must be authenticated');
  END IF;
  
  SELECT user_id INTO v_comment_owner FROM comments WHERE id = p_comment_id;
  
  IF v_comment_owner IS NULL THEN
    RETURN json_build_object('error', 'Comment not found');
  END IF;
  
  IF v_comment_owner != v_user_id THEN
    RETURN json_build_object('error', 'Not authorized to delete this comment');
  END IF;
  
  DELETE FROM comments WHERE id = p_comment_id;
  
  RETURN json_build_object('success', true);
END;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_blog_comments(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION add_blog_comment(UUID, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_blog_comment(UUID) TO authenticated;
