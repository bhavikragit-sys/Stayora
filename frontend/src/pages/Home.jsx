import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const Home = () => {
  const [exploreLoc, setExploreLoc] = useState('');
  const navigate = useNavigate();

  // Scroll triggered reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleExploreSearch = (e) => {
    e.preventDefault();
    if (exploreLoc.trim()) {
      navigate(`/listings?location=${encodeURIComponent(exploreLoc.trim())}`);
    }
  };

  return (
    <div className="w-full bg-[#FFFFFF] text-[#000000] selection:bg-[#E5342B] selection:text-white">
      
      {/* ── 1. CERCAL HOUSE STYLE HERO SECTION ── */}
      <section className="relative w-full h-screen min-h-[650px] overflow-hidden flex flex-col justify-between p-6 md:p-12 lg:p-16">
        {/* Background Image: White minimalist structure in field */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop"
            alt="Minimalist Architecture Background"
            className="w-full h-full object-cover"
          />
          {/* Subtle natural lighting overlay + top vignette for navbar visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/20" />
        </div>

        {/* Top Spacer to push content down */}
        <div className="z-10" />

        {/* Center: Massive typography overlay */}
        <div className="z-10 w-full text-center flex flex-col items-center justify-center flex-1">
          <h1 className="font-serif text-[12vw] sm:text-[10vw] leading-none text-white tracking-tight drop-shadow-sm select-none">
            Stayora
          </h1>
          <p className="text-white/90 text-xs md:text-sm font-sans tracking-[0.35em] uppercase mt-4 select-none">
            Beautiful stays, wherever you're going
          </p>
        </div>

        {/* Bottom: Scroll indicator */}
        <div className="z-10 w-full flex justify-center items-center">
          <div className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors duration-300">
            <div className="w-9 h-14 rounded-full border border-white/40 flex items-start justify-center p-1.5 backdrop-blur-[2px]">
              <div className="w-1.5 h-3 bg-white rounded-full animate-bounce" />
            </div>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase">Scroll Down</span>
          </div>
        </div>
      </section>

      {/* ── 2. EDITORIAL INTRO & GALLERY SECTION ── */}
      <section className="px-6 md:px-12 lg:px-20 py-24 max-w-7xl mx-auto space-y-16">
        
        {/* Header with Nav Arrows */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#E5E5E5] pb-8 reveal-on-scroll">
          <h2 className="font-editorial text-3xl md:text-4xl lg:text-5xl text-stayora-black max-w-2xl leading-tight font-medium">
            Discover villas, homes, and unique spaces for your next trip
          </h2>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/listings')}
              className="w-12 h-12 rounded-full border border-[#E5E5E5] flex items-center justify-center hover:bg-stayora-grey transition-all duration-300"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-stayora-black" />
            </button>
            <button 
              onClick={() => navigate('/listings')}
              className="w-12 h-12 rounded-full border border-[#E5E5E5] flex items-center justify-center hover:bg-stayora-grey transition-all duration-300"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-stayora-black" />
            </button>
          </div>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1 */}
          <div className="space-y-4 flex flex-col justify-between reveal-on-scroll">
            <div className="aspect-[3/4] overflow-hidden bg-stayora-grey">
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop" 
                alt="Natural Light Stay" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-stayora-black/40 uppercase tracking-widest block">
                • Countryside Cabins
              </span>
              <p className="text-sm font-semibold text-stayora-black">Nature & Wilderness</p>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-4 flex flex-col justify-between reveal-on-scroll">
            <div className="aspect-[3/4] overflow-hidden bg-stayora-grey">
              <img 
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop" 
                alt="Minimalist Elegance" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-stayora-black/40 uppercase tracking-widest block">
                • Beachfront Villas
              </span>
              <p className="text-sm font-semibold text-stayora-black">Coastal Getaways</p>
            </div>
          </div>

          {/* Col 3 */}
          <div className="space-y-4 flex flex-col justify-between reveal-on-scroll">
            <div className="aspect-[3/4] overflow-hidden bg-stayora-grey">
              <img 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop" 
                alt="Sliding Partitions Stay" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-stayora-black/40 uppercase tracking-widest block">
                • City Apartments
              </span>
              <p className="text-sm font-semibold text-stayora-black">Urban Lodgings</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. SUBTLE INFO BLOCKS (Tradition & Innovation Vibe) ── */}
      <section className="border-t border-b border-[#E5E5E5] bg-stayora-grey/30 py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch">
          
          {/* Tradition Column */}
          <div className="space-y-5 reveal-on-scroll">
            <div className="w-11 h-11 rounded-full border border-stayora-black/25 flex items-center justify-center">
              <span className="font-serif text-stayora-black text-sm">✻</span>
            </div>
            <h3 className="font-editorial text-2xl font-medium text-stayora-black">Find Your Stay</h3>
            <p className="text-stayora-black/60 text-sm leading-relaxed max-w-sm">
              Discover unique homes, villas, and rooms for your next trip, without paying more than you need to.
            </p>
          </div>

          {/* Innovation Column */}
          <div className="space-y-5 border-t border-[#E5E5E5] md:border-t-0 md:border-l md:pl-12 pt-8 md:pt-0 reveal-on-scroll">
            <div className="w-11 h-11 rounded-full border border-stayora-black/25 flex items-center justify-center">
              <span className="font-serif text-stayora-black text-sm">⁕</span>
            </div>
            <h3 className="font-editorial text-2xl font-medium text-stayora-black">Share Your Space</h3>
            <p className="text-stayora-black/60 text-sm leading-relaxed max-w-sm">
              List your villa, apartment, or room on Stayora and connect with travelers looking for great stays.
            </p>
          </div>

          {/* Book Now / Call to Action */}
          <div className="space-y-5 border-t border-[#E5E5E5] md:border-t-0 md:border-l md:pl-12 pt-8 md:pt-0 flex flex-col justify-between reveal-on-scroll">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-stayora-black/45 uppercase tracking-widest block">
                • Curation
              </span>
              <h3 className="font-serif text-3xl tracking-tight leading-snug text-stayora-black">
                A stay worth remembering.
              </h3>
            </div>
            <Link to="/listings" className="inline-flex items-center gap-2 text-sm font-semibold text-stayora-red hover:underline group self-start pt-4">
              <span>Book your stay ↗</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ── 4. MINIMALIST CONTACT / EXPLORE SECTION ── */}
      <section className="px-6 md:px-12 lg:px-20 py-24 max-w-7xl mx-auto space-y-16">
        
        {/* Title & Tag */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 reveal-on-scroll">
          <div className="space-y-2 text-left">
            <span className="text-[10px] font-bold text-stayora-black/45 uppercase tracking-widest block">
              • Partner with us
            </span>
            <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl text-stayora-black tracking-tight select-none">
              Have a space?
            </h2>
          </div>
          <Link to="/signup">
            <Button variant="primary" className="rounded-none uppercase tracking-widest text-xs font-bold px-8 py-3.5 bg-stayora-black text-white hover:bg-stayora-black/85 transition-colors">
              Become a host ↗
            </Button>
          </Link>
        </div>

        {/* Info Grid with Fine Gray Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 border-t border-[#E5E5E5] pt-12 text-left reveal-on-scroll">
          
          {/* Explore Location */}
          <div className="space-y-4 pr-6">
            <span className="text-[10px] font-bold text-stayora-black/45 uppercase tracking-widest block">
              Search destinations
            </span>
            <form onSubmit={handleExploreSearch} className="flex flex-col gap-2">
              <input 
                type="text" 
                placeholder="City or country..."
                value={exploreLoc}
                onChange={e => setExploreLoc(e.target.value)}
                className="border-b border-[#E5E5E5] pb-2 text-sm font-medium focus:outline-none focus:border-stayora-black transition-colors w-full bg-transparent placeholder-stayora-black/30"
              />
              <button type="submit" className="text-xs font-bold text-stayora-red hover:underline text-left self-start mt-1">
                Explore destinations
              </button>
            </form>
          </div>

          {/* Phone */}
          <div className="space-y-2 lg:border-l lg:border-[#E5E5E5] lg:pl-8">
            <span className="text-[10px] font-bold text-stayora-black/45 uppercase tracking-widest block">
              Support Line
            </span>
            <p className="text-base text-stayora-black/80 font-medium">917-888-00192</p>
          </div>

          {/* Email */}
          <div className="space-y-2 lg:border-l lg:border-[#E5E5E5] lg:pl-8">
            <span className="text-[10px] font-bold text-stayora-black/45 uppercase tracking-widest block">
              Email support
            </span>
            <a href="mailto:escapes@stayora.com" className="text-base text-stayora-black hover:text-stayora-red hover:underline font-medium transition-colors">
              escapes@stayora.com
            </a>
          </div>

          {/* Instagram */}
          <div className="space-y-2 lg:border-l lg:border-[#E5E5E5] lg:pl-8">
            <span className="text-[10px] font-bold text-stayora-black/45 uppercase tracking-widest block">
              Connect with us
            </span>
            <a href="#" className="text-base text-stayora-black hover:text-stayora-red hover:underline font-medium transition-colors">
              @stayora.escapes
            </a>
          </div>

        </div>

      </section>

    </div>
  );
};
