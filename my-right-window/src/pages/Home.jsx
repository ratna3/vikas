import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Scene from '../components/3d/Scene';

const Home = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      if (heroRef.current) {
        heroRef.current.style.opacity = Math.max(1 - scrolled / 500, 0);
        heroRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-deep-black">
      {/* 3D Background Scene */}
      <div className="fixed inset-0 z-0">
        <Scene />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div ref={heroRef} className="text-center max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-glow animate-slideUp">
            <span className="text-neon-green">My Right</span>
            <br />
            <span className="text-neon-cyan">Window</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            Exploring the Future of Technology, Innovation & Ideas
          </p>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: '0.4s' }}>
            Dive into cutting-edge insights, futuristic perspectives, and transformative concepts
            that shape tomorrow's digital landscape.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp" style={{ animationDelay: '0.6s' }}>
            <Link to="/blogs" className="btn-primary group">
              Explore Articles
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
            <a href="#featured" className="btn-secondary">
              Featured Posts
            </a>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section id="featured" className="relative z-10 py-20 px-4 bg-gradient-to-b from-transparent via-charcoal/30 to-deep-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-neon-green text-glow">
            Featured Insights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder Cards - Will be populated with real data */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="card group hover:box-glow transition-all duration-300">
                <div className="h-48 bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-6xl text-gray-700">📝</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                  Sample Article Title {item}
                </h3>
                <p className="text-gray-400 mb-4">
                  A glimpse into the future of technology and innovation. Discover insights that matter.
                </p>
                <Link to={`/blog/sample-${item}`} className="text-neon-orange hover:text-neon-green transition-colors inline-flex items-center">
                  Read More 
                  <span className="ml-1">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-neon-cyan text-glow">
            About My Right Window
          </h2>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            A digital observatory where technology meets imagination. We explore the intersection
            of innovation, culture, and the evolving digital frontier.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed">
            Through carefully curated content, we aim to provide perspectives that challenge
            conventional thinking and illuminate paths to the future.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 bg-gradient-to-t from-charcoal/50 to-transparent">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Stay Updated with Latest Insights
          </h2>
          <p className="text-gray-400 mb-8">
            Join our community and never miss groundbreaking content
          </p>
          <Link to="/blogs" className="btn-primary inline-flex items-center">
            View All Articles
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

