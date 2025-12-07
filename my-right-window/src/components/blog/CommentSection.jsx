import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useAuthStore } from '../../store';
import { 
  getComments, 
  addComment, 
  deleteComment,
  subscribeComments,
  signInWithGoogle,
  getUserProfile
} from '../../services/supabase';

const CommentSection = ({ blogId }) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const textareaRef = useRef(null);

  // Fetch initial comments
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const { data } = await getComments(blogId);
      setComments(data);
      setIsLoading(false);
    };

    fetchComments();
  }, [blogId]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await getUserProfile(user.id);
        setUserProfile(data);
      }
    };
    fetchProfile();
  }, [user]);

  // Subscribe to real-time comment changes
  useEffect(() => {
    const channel = subscribeComments(blogId, async (payload) => {
      if (payload.eventType === 'INSERT') {
        // Fetch the complete comment with user profile
        const { data } = await getComments(blogId);
        setComments(data);
      } else if (payload.eventType === 'DELETE') {
        setComments(prev => prev.filter(c => c.id !== payload.old.id));
      } else if (payload.eventType === 'UPDATE') {
        setComments(prev => prev.map(c => 
          c.id === payload.new.id ? { ...c, ...payload.new } : c
        ));
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [blogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await addComment(blogId, user.id, newComment.trim());
      if (!error && data) {
        setComments(prev => [...prev, data]);
        setNewComment('');
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    const { error } = await deleteComment(commentId, user.id);
    if (!error) {
      setComments(prev => prev.filter(c => c.id !== commentId));
    }
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
    setShowLoginPrompt(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleTextareaChange = (e) => {
    setNewComment(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          {user ? (
            <div className="flex-shrink-0">
              {userProfile?.avatar_url ? (
                <img 
                  src={userProfile.avatar_url} 
                  alt={userProfile.full_name || 'User'} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-navy/10 rounded-full flex items-center justify-center">
                  <span className="text-navy font-semibold">
                    {(userProfile?.full_name || user.email)?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={handleTextareaChange}
              onFocus={() => !user && setShowLoginPrompt(true)}
              placeholder={user ? "Share your thoughts..." : "Sign in to comment..."}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy resize-none transition-all"
              rows={1}
            />
            {newComment.trim() && user && (
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50 font-medium"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 animate-slideUp">
              <div className="flex-shrink-0">
                {comment.user_profiles?.avatar_url ? (
                  <img 
                    src={comment.user_profiles.avatar_url} 
                    alt={comment.user_profiles.full_name || 'User'} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-navy/10 rounded-full flex items-center justify-center">
                    <span className="text-navy font-semibold text-sm">
                      {(comment.user_profiles?.full_name)?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-900">
                      {comment.user_profiles?.full_name || 'Anonymous'}
                    </span>
                    <span className="text-sm text-gray-400">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
                {user && user.id === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="mt-1 text-sm text-red-500 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLoginPrompt(false)}>
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Sign in to comment</h3>
            <p className="text-gray-600 mb-6">Join our community to engage in discussions.</p>
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium text-gray-700">Continue with Google</span>
            </button>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

CommentSection.propTypes = {
  blogId: PropTypes.string.isRequired,
};

export default CommentSection;
