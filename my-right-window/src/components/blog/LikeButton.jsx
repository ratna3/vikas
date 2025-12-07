import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuthStore } from '../../store';
import { 
  getLikeCount, 
  hasUserLiked, 
  toggleLike, 
  subscribeLikes,
  signInWithGoogle 
} from '../../services/supabase';

const LikeButton = ({ blogId }) => {
  const { user } = useAuthStore();
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Fetch initial like count and user's like status
  useEffect(() => {
    const fetchLikeData = async () => {
      const { count } = await getLikeCount(blogId);
      setLikeCount(count);

      if (user) {
        const { hasLiked: liked } = await hasUserLiked(blogId, user.id);
        setHasLiked(liked);
      }
    };

    fetchLikeData();
  }, [blogId, user]);

  // Subscribe to real-time like changes
  useEffect(() => {
    const channel = subscribeLikes(blogId, async () => {
      // Refetch like count on any change
      const { count } = await getLikeCount(blogId);
      setLikeCount(count);
      
      // Update user's like status if logged in
      if (user) {
        const { hasLiked: liked } = await hasUserLiked(blogId, user.id);
        setHasLiked(liked);
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [blogId, user]);

  const handleLikeClick = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    setIsLoading(true);
    try {
      const { liked, error } = await toggleLike(blogId, user.id);
      if (!error) {
        setHasLiked(liked);
        setLikeCount(prev => liked ? prev + 1 : prev - 1);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
    setShowLoginPrompt(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleLikeClick}
        disabled={isLoading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
          ${hasLiked 
            ? 'bg-red-50 text-red-500 border-2 border-red-200 hover:bg-red-100' 
            : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        aria-label={hasLiked ? 'Unlike this article' : 'Like this article'}
      >
        <svg 
          className={`w-5 h-5 transition-transform duration-300 ${hasLiked ? 'scale-110' : ''}`} 
          fill={hasLiked ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
        <span className="font-semibold">{likeCount}</span>
        <span className="hidden sm:inline">{likeCount === 1 ? 'Like' : 'Likes'}</span>
      </button>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLoginPrompt(false)}>
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Sign in to like</h3>
            <p className="text-gray-600 mb-6">Join our community to like and engage with articles.</p>
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

LikeButton.propTypes = {
  blogId: PropTypes.string.isRequired,
};

export default LikeButton;
