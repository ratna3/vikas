import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder-key';
};

// Create client with conditional realtime support
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: isSupabaseConfigured(),
    persistSession: isSupabaseConfigured(),
    detectSessionInUrl: isSupabaseConfigured()
  },
  realtime: isSupabaseConfigured() ? {
    params: {
      eventsPerSecond: 10
    }
  } : undefined
});

// Google OAuth Sign In
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/blogs`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  return { data, error };
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Get user profile
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

// ============ LIKES FUNCTIONS ============

// Get like count for a blog
export const getLikeCount = async (blogId) => {
  try {
    // Try RPC function first
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('get_like_count', { p_blog_id: blogId });
    
    if (!rpcError) {
      return { count: rpcData || 0, error: null };
    }
    
    // Fallback to direct table access
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('blog_id', blogId);
    
    if (error && error.code === 'PGRST204') {
      // Table not found - return 0 gracefully
      return { count: 0, error: null };
    }
    
    return { count: data?.length || 0, error };
  } catch (err) {
    console.warn('Likes feature not available:', err.message);
    return { count: 0, error: null };
  }
};

// Check if user has liked a blog
export const hasUserLiked = async (blogId, userId) => {
  if (!userId) return { hasLiked: false, error: null };
  
  try {
    // Try RPC function first
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('has_user_liked', { p_blog_id: blogId, p_user_id: userId });
    
    if (!rpcError) {
      return { hasLiked: rpcData || false, error: null };
    }
    
    // Fallback to direct table access
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('blog_id', blogId)
      .eq('user_id', userId)
      .single();
    
    return { hasLiked: !!data, error: error?.code === 'PGRST116' ? null : error };
  } catch (err) {
    console.warn('Like check not available:', err.message);
    return { hasLiked: false, error: null };
  }
};

// Toggle like
export const toggleLike = async (blogId, userId) => {
  try {
    // Try RPC function first
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('toggle_like', { p_blog_id: blogId });
    
    if (!rpcError && rpcData) {
      return { liked: rpcData.liked, count: rpcData.count, error: null };
    }
    
    // Fallback to direct table access
    const { hasLiked } = await hasUserLiked(blogId, userId);
    
    if (hasLiked) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('blog_id', blogId)
        .eq('user_id', userId);
      return { liked: false, error };
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({ blog_id: blogId, user_id: userId });
      return { liked: true, error };
    }
  } catch (err) {
    console.error('Toggle like failed:', err.message);
    return { liked: false, error: err };
  }
};

// Subscribe to likes changes
export const subscribeLikes = (blogId, callback) => {
  const channel = supabase
    .channel(`likes-${blogId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'likes', filter: `blog_id=eq.${blogId}` },
      callback
    )
    .subscribe();
  return channel;
};

// ============ COMMENTS FUNCTIONS ============

// Get comments for a blog
export const getComments = async (blogId) => {
  try {
    // Try RPC function first
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('get_blog_comments', { p_blog_id: blogId });
    
    if (!rpcError && rpcData) {
      return { data: rpcData, error: null };
    }
    
    // Fallback to direct table access
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .eq('blog_id', blogId)
      .order('created_at', { ascending: true });
    
    if (commentsError) {
      if (commentsError.code === 'PGRST204' || commentsError.message?.includes('404')) {
        // Table not found - return empty gracefully
        return { data: [], error: null };
      }
      return { data: [], error: commentsError };
    }
    
    if (!comments || comments.length === 0) {
      return { data: [], error: null };
    }
    
    // Get user profiles for all comment authors
    const userIds = [...new Set(comments.map(c => c.user_id))];
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('id, full_name, avatar_url')
      .in('id', userIds);
    
    // Map profiles to comments
    const profileMap = (profiles || []).reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});
    
    const commentsWithProfiles = comments.map(comment => ({
      ...comment,
      user_profiles: profileMap[comment.user_id] || { full_name: 'Anonymous', avatar_url: null }
    }));
    
    return { data: commentsWithProfiles, error: null };
  } catch (err) {
    console.warn('Comments feature not available:', err.message);
    return { data: [], error: null };
  }
};

// Add a comment
export const addComment = async (blogId, userId, content, parentId = null) => {
  try {
    // Try RPC function first
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('add_blog_comment', { 
        p_blog_id: blogId, 
        p_content: content, 
        p_parent_id: parentId 
      });
    
    if (!rpcError && rpcData && !rpcData.error) {
      return { data: rpcData, error: null };
    }
    
    // Fallback to direct table access
    const { data, error } = await supabase
      .from('comments')
      .insert({ 
        blog_id: blogId, 
        user_id: userId, 
        content,
        parent_id: parentId 
      })
      .select('*')
      .single();
    
    if (error) return { data: null, error };
    
    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id, full_name, avatar_url')
      .eq('id', userId)
      .single();
    
    return { 
      data: {
        ...data,
        user_profiles: profile || { full_name: 'Anonymous', avatar_url: null }
      }, 
      error: null 
    };
  } catch (err) {
    console.error('Add comment failed:', err.message);
    return { data: null, error: err };
  }
};

// Delete a comment
export const deleteComment = async (commentId, userId) => {
  try {
    // Try RPC function first
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('delete_blog_comment', { p_comment_id: commentId });
    
    if (!rpcError && rpcData && !rpcData.error) {
      return { error: null };
    }
    
    // Fallback to direct table access
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId);
    return { error };
  } catch (err) {
    console.error('Delete comment failed:', err.message);
    return { error: err };
  }
};

// Update a comment
export const updateComment = async (commentId, userId, content) => {
  const { data, error } = await supabase
    .from('comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .eq('user_id', userId)
    .select()
    .single();
  return { data, error };
};

// Subscribe to comments changes
export const subscribeComments = (blogId, callback) => {
  const channel = supabase
    .channel(`comments-${blogId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'comments', filter: `blog_id=eq.${blogId}` },
      callback
    )
    .subscribe();
  return channel;
};

