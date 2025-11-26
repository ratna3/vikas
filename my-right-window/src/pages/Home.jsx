import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ModelScene from '../components/3d/ModelScene';

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

  const models = [
    {
      path: '/models/angel_of_justice.glb',
      tagline: 'Justice is blind, but our vision is clear. Laws for everyone.',
      scale: 2,
    },
    {
      path: '/models/queen_chess.glb',
      tagline: 'Strategic counsel in every move. Mastering the complexities of law.',
      scale: 1.5,
    },
    {
      path: '/models/gavel.glb',
      tagline: 'Power and influence, used with uncompromising integrity.',
      scale: 1.8,
    },
  ];

  return (
    <div className="relative min-h-screen bg-deep-black">
      {/* Hero Section with Title */}
      <section className="relative z-10 py-20 px-4 bg-linear-to-b from-charcoal/50 to-transparent">
        <div ref={heroRef} className="text-center max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-glow animate-slideUp">
            <span className="text-neon-green">My Right</span>
            <br />
            <span className="text-neon-cyan">Window</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            Your Partner in Legal Excellence
          </p>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: '0.4s' }}>
            Providing expert legal counsel with integrity, strategy, and unwavering commitment to justice.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp" style={{ animationDelay: '0.6s' }}>
            <Link to="/blogs" className="btn-primary group">
              Explore Articles
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
            <a href="#principles" className="btn-secondary">
              Our Principles
            </a>
          </div>
        </div>
      </section>

      {/* 3D Models Section */}
      <section id="principles" className="relative z-10 py-20 px-4 bg-deep-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-neon-green text-glow">
            Our Core Values
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {models.map((model, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* 3D Model Container */}
                <div className="w-full h-80 md:h-96 mb-6 rounded-lg overflow-hidden bg-linear-to-br from-charcoal/30 to-deep-black border border-neon-cyan/20 hover:border-neon-green/40 transition-all duration-300 box-glow">
                  <ModelScene 
                    modelPath={model.path} 
                    scale={model.scale}
                    cameraPosition={[0, 0, 5]}
                  />
                </div>
                
                {/* Tagline */}
                <p className="text-center text-lg md:text-xl text-gray-200 leading-relaxed max-w-sm px-4 font-medium">
                  {model.tagline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section id="featured" className="relative z-10 py-20 px-4 bg-linear-to-b from-transparent via-charcoal/30 to-deep-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-neon-green text-glow">
            Featured Insights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder Cards - Will be populated with real data */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="card group hover:box-glow transition-all duration-300">
                <div className="h-48 bg-linear-to-br from-neon-green/20 to-neon-cyan/20 rounded-lg mb-4 flex items-center justify-center">
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
            Your trusted legal partner, committed to delivering exceptional counsel with integrity and expertise.
            We navigate complex legal challenges with strategic precision.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed">
            Through our unwavering dedication to justice, we ensure every client receives the representation
            they deserve. Our approach combines deep legal knowledge with compassionate understanding.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 bg-linear-to-t from-charcoal/50 to-transparent">
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


