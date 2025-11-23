import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function BlogCard({ blog }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get first image or use placeholder
  const thumbnail = blog.images && blog.images.length > 0 
    ? blog.images[0] 
    : null;

  // Truncate content for preview
  const previewText = blog.content.length > 150 
    ? blog.content.substring(0, 150) + '...' 
    : blog.content;

  return (
    <article className="card group hover:border-neon-green transition-all duration-300">
      {/* Thumbnail */}
      {thumbnail && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={thumbnail}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-deep-black/80 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-semibold text-neon-cyan bg-neon-cyan/10 rounded-full border border-neon-cyan/30"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neon-green transition-colors">
          <Link to={`/blog/${blog.slug}`} className="hover:underline">
            {blog.title}
          </Link>
        </h3>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            {blog.author}
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {formatDate(blog.created_at)}
          </span>
        </div>

        {/* Preview text */}
        <p className="text-gray-300 mb-4 line-clamp-3">
          {previewText}
        </p>

        {/* Read more link */}
        <Link
          to={`/blog/${blog.slug}`}
          className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-green transition-colors font-semibold"
        >
          Read More
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>

        {/* PDF indicator */}
        {blog.pdf_url && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <span className="inline-flex items-center gap-2 text-sm text-neon-orange">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              PDF Available
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

BlogCard.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.arrayOf(PropTypes.string),
    pdf_url: PropTypes.string,
    pdf_name: PropTypes.string,
  }).isRequired,
};
