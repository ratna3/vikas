import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlogStore } from '../store';
import PDFViewer from '../components/blog/PDFViewer';
import ImageGallery from '../components/blog/ImageGallery';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { currentBlog, isLoading, error, fetchBlogBySlug } = useBlogStore();

  useEffect(() => {
    if (slug) {
      fetchBlogBySlug(slug);
    }
  }, [slug, fetchBlogBySlug]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-black pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-400">Loading blog...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !currentBlog) {
    return (
      <div className="min-h-screen bg-deep-black pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="card p-8 text-center">
              <svg className="w-16 h-16 text-neon-orange mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-bold text-white mb-2">Blog Not Found</h3>
              <p className="text-gray-400 mb-6">{error || 'The blog you are looking for does not exist.'}</p>
              <button onClick={() => navigate('/blogs')} className="btn-primary">
                Back to Blogs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <div className="max-w-4xl mx-auto mb-8">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-green transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blogs
          </Link>
        </div>

        {/* Blog Content */}
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8 animate-slideUp">
            {/* Tags */}
            {currentBlog.tags && currentBlog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {currentBlog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm font-semibold text-neon-cyan bg-neon-cyan/10 rounded-full border border-neon-cyan/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-5xl font-bold text-white mb-6 text-glow">
              {currentBlog.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 pb-6 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-white">{currentBlog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>{formatDate(currentBlog.created_at)}</span>
              </div>
              {currentBlog.updated_at !== currentBlog.created_at && (
                <div className="flex items-center gap-2 text-neon-orange">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Updated {formatDate(currentBlog.updated_at)}</span>
                </div>
              )}
            </div>
          </header>

          {/* Main Content */}
          <div className="prose prose-invert prose-lg max-w-none mb-12 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <div className="card p-8">
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {currentBlog.content}
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          {currentBlog.images && currentBlog.images.length > 0 && (
            <div className="mb-12 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <ImageGallery images={currentBlog.images} />
            </div>
          )}

          {/* PDF Viewer */}
          {currentBlog.pdf_url && (
            <div className="mb-12 animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <PDFViewer pdfUrl={currentBlog.pdf_url} pdfName={currentBlog.pdf_name} />
            </div>
          )}

          {/* Footer - Share and Navigation */}
          <footer className="pt-8 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Share buttons */}
              <div className="flex items-center gap-3">
                <span className="text-gray-400 font-semibold">Share:</span>
                <button
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                  }}
                  className="p-2 bg-charcoal hover:bg-neon-cyan/10 border border-gray-700 hover:border-neon-cyan text-neon-cyan rounded-lg transition-all"
                  aria-label="Copy link"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              {/* Back button */}
              <Link to="/blogs" className="btn-secondary">
                View All Blogs
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
