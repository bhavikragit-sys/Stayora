import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import { Home }           from './pages/Home.jsx';
import { Listings }       from './pages/Listings.jsx';
import { ListingDetails } from './pages/ListingDetails.jsx';
import { Login }          from './pages/Login.jsx';
import { Signup }         from './pages/Signup.jsx';
import { Dashboard }      from './pages/Dashboard.jsx';
import { ListingCreate }  from './pages/ListingCreate.jsx';
import { ListingEdit }    from './pages/ListingEdit.jsx';
import { BookingConfirm } from './pages/BookingConfirm.jsx';
import { Bookings }       from './pages/Bookings.jsx';
import { Profile }        from './pages/Profile.jsx';
import { PublicProfile }  from './pages/PublicProfile.jsx';
import { Privacy }        from './pages/Privacy.jsx';
import { Terms }          from './pages/Terms.jsx';
import { Contact }        from './pages/Contact.jsx';
import { Editorial }      from './pages/Editorial.jsx';
import { About }          from './pages/About.jsx';

import { Navbar }  from './components/layout/Navbar.jsx';
import { Footer }  from './components/layout/Footer.jsx';
import { useAuth } from './context/AuthContext';

// ── Page title map ────────────────────────────────────────────────────────────
const PAGE_TITLES = {
  '/':           'STAYORA — Find Your Perfect Stay',
  '/listings':   'Explore Stays · STAYORA',
  '/login':      'Log In · STAYORA',
  '/signup':     'Create Account · STAYORA',
  '/dashboard':  'Your Listings · STAYORA',
  '/bookings':   'Your Bookings · STAYORA',
  '/profile':    'My Profile · STAYORA',
  '/editorial':  'Editorial · STAYORA',
  '/about':      'About · STAYORA',
  '/privacy':    'Privacy · STAYORA',
  '/terms':      'Terms · STAYORA',
  '/contact':    'Contact · STAYORA',
};

// ── Protected route ───────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="p-12 text-center text-stayora-black/50">Loading...</div>;
  return user ? children : <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} />;
};

const NotFound = () => <div className="px-6 py-16 text-stayora-red font-bold text-2xl">404 — Not Found</div>;

// ── Animated page wrapper ─────────────────────────────────────────────────────
const PageWrapper = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isFading, setIsFading] = useState(false);

  // Update document title on route change
  useEffect(() => {
    const base = Object.entries(PAGE_TITLES).find(([path]) => {
      if (path === '/') return location.pathname === '/';
      return location.pathname.startsWith(path);
    });
    if (base) document.title = base[1];
  }, [location.pathname]);

  // Sync children when props change without triggering transition
  useEffect(() => {
    setDisplayChildren(children);
  }, [children]);

  // Handle smooth scroll reset and subtle transition ONLY on true route/search navigation
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsFading(true);
    
    const fadeOutTimer = setTimeout(() => {
      setIsFading(false);
    }, 180);

    return () => clearTimeout(fadeOutTimer);
  }, [location.pathname, location.search]);

  return (
    <div className={`flex-1 transition-all duration-300 ease-out ${isFading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}>
      {displayChildren}
    </div>
  );
};

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  return (
    <div className="min-h-screen flex flex-col bg-stayora-white text-stayora-black">
      <Navbar />
      <PageWrapper>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/signup"     element={<Signup />} />
          <Route path="/listings"   element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetails />} />
          <Route path="/listings/:id/book" element={<ProtectedRoute><BookingConfirm /></ProtectedRoute>} />
          <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/listings/new" element={<ProtectedRoute><ListingCreate /></ProtectedRoute>} />
          <Route path="/dashboard/listings/:id/edit" element={<ProtectedRoute><ListingEdit /></ProtectedRoute>} />
          <Route path="/bookings"   element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
          <Route path="/profile"    element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/users/:id"  element={<PublicProfile />} />
          <Route path="/privacy"    element={<Privacy />} />
          <Route path="/terms"      element={<Terms />} />
          <Route path="/contact"    element={<Contact />} />
          <Route path="/editorial"  element={<Editorial />} />
          <Route path="/about"      element={<About />} />
          <Route path="*"           element={<NotFound />} />
        </Routes>
      </PageWrapper>
      <Footer />
    </div>
  );
}

export default App;
