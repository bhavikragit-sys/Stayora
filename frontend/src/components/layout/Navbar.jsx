import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
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
      await axios.post('/api/auth/logout');
      setUser(null);
      queryClient.clear();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  // Determine theme styling based on route and scroll state (always solid on mobile for visibility)
  const isTransparent = isHome && !isScrolled && !isMobile;

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 h-20 z-50 flex items-center justify-between px-6 md:px-12 lg:px-20 transition-all duration-500 ease-in-out ${
          isTransparent 
            ? 'bg-transparent text-white border-b border-white/10' 
            : 'bg-white/90 backdrop-blur-md text-stayora-black border-b border-stayora-black/[0.04]'
        }`}
      >
        {/* Left — Brand Logo (Serif Italiana) */}
        <div className="flex-1 flex items-center">
          <Link 
            to="/" 
            className={`font-serif text-2xl tracking-[0.05em] transition-colors duration-500 ${
              isTransparent ? 'text-white' : 'text-stayora-black'
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

          {/* Mobile Hamburger Menu */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col justify-center space-y-1.5 w-8 h-8 focus:outline-none z-50 relative" 
            aria-label="Menu"
          >
            <span className={`block w-6 h-[1.5px] transform transition-all duration-300 ${isTransparent ? 'bg-white' : 'bg-stayora-black'} ${isMobileMenuOpen ? 'rotate-45 translate-y-[7.5px]' : ''}`}></span>
            <span className={`block w-6 h-[1.5px] transition-opacity duration-300 ${isTransparent ? 'bg-white' : 'bg-stayora-black'} ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-[1.5px] transform transition-all duration-300 ${isTransparent ? 'bg-white' : 'bg-stayora-black'} ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7.5px]' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-stayora-black/25 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Mobile Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-[290px] max-w-full bg-white/80 backdrop-blur-md border-l border-[#E5E5E5]/35 z-50 shadow-2xl p-8 flex flex-col justify-between transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-8 text-left">
          <div className="flex justify-between items-center pb-4 border-b border-[#E5E5E5]/50">
            <span className="font-serif text-xl tracking-[0.05em]">Stayora</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="w-8 h-8 flex items-center justify-center border border-[#E5E5E5]/50 text-stayora-black text-xs hover:bg-stayora-grey focus:outline-none"
            >
              ✕
            </button>
          </div>
          
          <nav className="flex flex-col space-y-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name + link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex justify-between items-center bg-stayora-grey/50 hover:bg-[#EAEAEA] px-4 py-3.5 text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-stayora-black transition-all duration-300 select-none w-full"
              >
                <span>{link.name}</span>
                <span className="text-stayora-black/35 font-serif">→</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-4 border-t border-[#E5E5E5]/50 pt-6">
          {user ? (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-center text-xs font-sans font-bold tracking-[0.2em] uppercase py-3.5 bg-stayora-red border border-stayora-red text-white hover:bg-[#c9201a] transition-all duration-300"
            >
              Log Out
            </button>
          ) : (
            <div className="flex flex-col space-y-3">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center text-xs font-sans font-bold tracking-[0.2em] uppercase py-3.5 bg-stayora-grey hover:bg-[#EAEAEA] text-stayora-black transition-colors block"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center text-xs font-sans font-bold tracking-[0.2em] uppercase py-3.5 bg-stayora-black border border-stayora-black text-white hover:bg-stayora-black/85 transition-all duration-350 block"
              >
                Register ↗
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
