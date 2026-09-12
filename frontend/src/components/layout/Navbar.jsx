import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api/axios';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, setUser } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = user
    ? [
        { name: 'Explore Stays',  path: '/listings'  },
        { name: 'Your Listings',  path: '/dashboard' },
        { name: 'Your Bookings',  path: '/bookings'  },
        { name: 'My Profile',     path: '/profile'   },
      ]
    : [
        { name: 'Explore Stays', path: '/listings'  },
        { name: 'Editorial',     path: '/editorial' },
        { name: 'About',         path: '/about'     },
      ];

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      setUser(null);
      queryClient.clear();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  // Determine theme styling based on route and scroll state (transparent on home hero section)
  const isTransparent = isHome && !isScrolled;

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 h-20 z-50 flex items-center justify-between px-6 md:px-12 lg:px-20 transition-all duration-500 ease-in-out ${
          isMobileMenuOpen
            ? 'bg-transparent text-stayora-black border-b border-stayora-black/[0.06]'
            : isTransparent 
              ? 'bg-gradient-to-b from-black/50 via-black/15 to-transparent text-white border-b border-white/10' 
              : 'bg-white/90 backdrop-blur-md text-stayora-black border-b border-stayora-black/[0.04]'
        }`}
      >
        {/* Left — Brand Logo (Serif Italiana) */}
        <div className="flex-1 flex items-center">
          <Link 
            to="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`font-serif text-2xl tracking-[0.05em] transition-colors duration-500 ${
              isMobileMenuOpen
                ? 'text-stayora-black'
                : isTransparent ? 'text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]' : 'text-stayora-black'
            }`}
          >
            Stayora
          </Link>
        </div>

        {/* Center — Nav Links (Thin spaced-out sans-serif) */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link, idx) => {
            const isActive = user
              ? location.pathname.startsWith(link.path)
              : (idx === 0 && location.pathname === '/listings') || location.pathname === link.path;
            
            return (
              <Link
                key={link.name + link.path}
                to={link.path}
                className={`group text-[11px] font-sans font-bold tracking-[0.25em] uppercase relative py-2 transition-all duration-300 ${
                  isTransparent 
                    ? isActive ? 'text-white' : 'text-white/60 hover:text-white'
                    : isActive ? 'text-stayora-black' : 'text-stayora-black/50 hover:text-stayora-black'
                }`}
              >
                {link.name}
                <span 
                  className={`absolute bottom-0 left-0 h-[1px] transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  } ${
                    isTransparent ? 'bg-white' : 'bg-stayora-black'
                  }`} 
                />
              </Link>
            );
          })}
        </div>

        {/* Right — Auth Actions */}
        <div className="flex-1 flex items-center justify-end space-x-6">
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <button
                onClick={handleLogout}
                className={`text-[11px] font-sans font-bold tracking-[0.25em] uppercase transition-colors duration-300 ${
                  isTransparent ? 'text-white/60 hover:text-white' : 'text-stayora-black/50 hover:text-stayora-red'
                }`}
              >
                Log Out
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`text-[11px] font-sans font-bold tracking-[0.25em] uppercase transition-colors duration-300 ${
                    isTransparent ? 'text-white/60 hover:text-white' : 'text-stayora-black/50 hover:text-stayora-black'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className={`text-[11px] font-sans font-bold tracking-[0.2em] uppercase px-5 py-2.5 transition-all duration-500 border rounded-none ${
                    isTransparent 
                      ? 'border-white text-white hover:bg-white hover:text-stayora-black' 
                      : 'border-stayora-black bg-stayora-black text-white hover:bg-transparent hover:text-stayora-black'
                  }`}
                >
                  Register ↗
                </Link>
              </>
            )}
          </div>

          {/* Mobile Animated Morphing Hamburger / Close Icon (min 44x44px tap target) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-11 h-11 -mr-2 focus:outline-none group relative z-50 select-none" 
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <div className="w-6 h-5 relative flex flex-col justify-between items-end">
              {/* Top Bar */}
              <span 
                className={`h-[1.5px] transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                  isMobileMenuOpen 
                    ? 'w-6 rotate-45 translate-y-[9px] bg-stayora-black' 
                    : `w-6 ${isTransparent ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.6)]' : 'bg-stayora-black'}`
                }`} 
              />
              {/* Middle Bar (Architectural shorter bar that collapses) */}
              <span 
                className={`h-[1.5px] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isMobileMenuOpen 
                    ? 'w-0 opacity-0 bg-stayora-black' 
                    : `w-4 group-hover:w-6 opacity-100 ${isTransparent ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.6)]' : 'bg-stayora-black'}`
                }`} 
              />
              {/* Bottom Bar */}
              <span 
                className={`h-[1.5px] transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] origin-center ${
                  isMobileMenuOpen 
                    ? 'w-6 -rotate-45 -translate-y-[9.5px] bg-stayora-black' 
                    : `w-6 ${isTransparent ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.6)]' : 'bg-stayora-black'}`
                }`} 
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Full-Screen Mobile Overlay Menu */}
      <div 
        className={`fixed inset-0 z-40 w-full h-[100dvh] bg-white/95 backdrop-blur-xl flex flex-col justify-between pt-24 px-6 pb-8 md:hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMobileMenuOpen 
            ? 'opacity-100 translate-y-0 pointer-events-auto visible' 
            : 'opacity-0 -translate-y-8 pointer-events-none invisible'
        }`}
      >
        {/* Mobile Nav Links with Staggered Cascading Reveal */}
        <div className="flex-1 overflow-y-auto py-6 flex flex-col justify-center">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link, idx) => {
              const isActive = user
                ? location.pathname.startsWith(link.path)
                : (idx === 0 && location.pathname === '/listings') || location.pathname === link.path;

              return (
                <Link
                  key={link.name + link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${120 + idx * 60}ms` : '0ms'
                  }}
                  className={`group flex items-center justify-between min-h-[52px] py-3.5 border-b border-stayora-black/[0.06] text-[17px] font-sans font-bold tracking-[0.25em] uppercase transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isMobileMenuOpen 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4'
                  } ${
                    isActive
                      ? 'text-stayora-black'
                      : 'text-stayora-black/50 hover:text-stayora-black'
                  }`}
                >
                  <span className="relative">
                    {link.name}
                    <span 
                      className={`absolute -bottom-1 left-0 h-[1.5px] transition-all duration-300 ${
                        isActive ? 'w-full bg-stayora-black' : 'w-0 group-hover:w-full bg-stayora-black/40'
                      }`} 
                    />
                  </span>
                  <span className={`font-serif text-lg transition-transform duration-300 ${
                    isActive 
                      ? 'text-stayora-black translate-x-1' 
                      : 'text-stayora-black/25 group-hover:text-stayora-black/60 group-hover:translate-x-1'
                  }`}>
                    ↗
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Bottom CTA Section with Staggered Fade */}
        <div 
          style={{
            transitionDelay: isMobileMenuOpen ? `${120 + navLinks.length * 60}ms` : '0ms'
          }}
          className={`pb-4 pt-4 border-t border-stayora-black/[0.06] flex-shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {user ? (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full min-h-[48px] flex items-center justify-center text-center text-xs font-sans font-bold tracking-[0.2em] uppercase py-3.5 bg-stayora-red border border-stayora-red text-white hover:bg-[#c9201a] transition-all duration-300"
            >
              Log Out
            </button>
          ) : (
            <div className="flex flex-col space-y-3">
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full min-h-[48px] flex items-center justify-center text-center text-xs font-sans font-bold tracking-[0.2em] uppercase py-4 bg-stayora-black border border-stayora-black text-white hover:bg-transparent hover:text-stayora-black transition-all duration-300"
              >
                Register ↗
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full min-h-[44px] flex items-center justify-center text-center text-xs font-sans font-bold tracking-[0.25em] uppercase py-3 text-stayora-black/60 hover:text-stayora-black transition-colors"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
