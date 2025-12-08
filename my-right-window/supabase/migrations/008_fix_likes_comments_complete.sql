-- Fix likes and comments RLS policies and RPC functions
-- Run this in Supabase SQL Editor

-- ============ LIKES TABLE RLS ============

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view likes" ON likes;
DROP POLICY IF EXISTS "Authenticated users can insert their own likes" ON likes;
DROP POLICY IF EXISTS "Users can delete their own likes" ON likes;

-- Anyone can view likes (for counting)
CREATE POLICY "Anyone can view likes" ON likes
  FOR SELECT USING (true);

-- Authenticated users can insert their own likes
CREATE POLICY "Authenticated users can insert their own likes" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "Users can delete their own likes" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- ============ COMMENTS TABLE RLS ============

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

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

-- ============ USER PROFILES RLS ============

-- Allow public to view user display info (needed for comments display)
DROP POLICY IF EXISTS "Public can view user display info" ON user_profiles;
CREATE POLICY "Public can view user display info" ON user_profiles
  FOR SELECT USING (true);

-- ============ LIKES RPC FUNCTIONS ============

-- Function to get like count for a blog
CREATE OR REPLACE FUNCTION get_like_count(p_blog_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (SELECT COUNT(*)::INTEGER FROM likes WHERE blog_id = p_blog_id);
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
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to like';
  END IF;
  
  IF EXISTS (SELECT 1 FROM likes WHERE blog_id = p_blog_id AND user_id = v_user_id) THEN
    DELETE FROM likes WHERE blog_id = p_blog_id AND user_id = v_user_id;
    v_liked := FALSE;
  ELSE
    INSERT INTO likes (blog_id, user_id) VALUES (p_blog_id, v_user_id);
    v_liked := TRUE;
  END IF;
  
  SELECT COUNT(*)::INTEGER INTO v_count FROM likes WHERE blog_id = p_blog_id;
  
  RETURN json_build_object('liked', v_liked, 'count', v_count);
END;
$$;

-- ============ COMMENTS RPC FUNCTIONS ============

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

-- ============ GRANT PERMISSIONS ============

GRANT EXECUTE ON FUNCTION get_like_count(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION has_user_liked(UUID, UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION toggle_like(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_blog_comments(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION add_blog_comment(UUID, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_blog_comment(UUID) TO authenticated;

-- ============ AUTO-CREATE USER PROFILE ON SIGNUP ============

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO user_profiles (id, email, role, full_name, avatar_url)
  VALUES (
    NEW.id, 
    NEW.email, 
    'user',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, user_profiles.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for auto-creating user profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Success message
SELECT 'All RLS policies and RPC functions have been set up successfully!' as status;
