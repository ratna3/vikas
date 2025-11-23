import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore, useBlogStore } from '../../store';
import { supabase } from '../../services/supabase';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const { blogs, fetchBlogs } = useBlogStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }
      setUser(session.user);
    };

    const loadData = async () => {
      await fetchBlogs();
      setLoading(false);
    };

    checkAuth();
    loadData();
  }, [navigate, setUser, fetchBlogs]);

  useEffect(() => {
    if (blogs.length > 0) {
      setStats({
        total: blogs.length,
        published: blogs.filter(b => b.published).length,
        drafts: blogs.filter(b => !b.published).length,
      });
    }
  }, [blogs]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/admin/login');
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchBlogs();
    } catch (error) {
      alert('Error deleting blog: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-neon-green text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-neon-green">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">Welcome, {user?.email}</p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/"
                className="px-4 py-2 border border-cyan text-cyan rounded-lg hover:bg-cyan hover:text-black transition-colors"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-orange text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm mb-2">Total Posts</h3>
            <p className="text-4xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-slate-900 border border-neon-green rounded-lg p-6">
            <h3 className="text-gray-400 text-sm mb-2">Published</h3>
            <p className="text-4xl font-bold text-neon-green">{stats.published}</p>
          </div>
          <div className="bg-slate-900 border border-orange rounded-lg p-6">
            <h3 className="text-gray-400 text-sm mb-2">Drafts</h3>
            <p className="text-4xl font-bold text-orange">{stats.drafts}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <Link
            to="/admin/editor"
            className="inline-block bg-neon-green text-black font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            + Create New Post
          </Link>
        </div>

        {/* Blog List */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="text-xl font-bold">All Blog Posts</h2>
          </div>
          
          <div className="divide-y divide-slate-800">
            {blogs.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-400">
                No blog posts yet. Create your first post!
              </div>
            ) : (
              blogs.map((blog) => (
                <div key={blog.id} className="px-6 py-4 hover:bg-slate-800 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{blog.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            blog.published
                              ? 'bg-neon-green/20 text-neon-green'
                              : 'bg-orange/20 text-orange'
                          }`}
                        >
                          {blog.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        By {blog.author} • {new Date(blog.created_at).toLocaleDateString()}
                      </p>
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex gap-2">
                          {blog.tags.map((tag) => (
                            <span key={tag} className="text-xs text-cyan">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/editor/${blog.id}`}
                        className="px-3 py-1 border border-cyan text-cyan rounded hover:bg-cyan hover:text-black transition-colors text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="px-3 py-1 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
