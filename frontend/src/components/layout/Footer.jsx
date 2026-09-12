import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const EXPLORE_LINKS = [
  { label: 'All Stays',    path: '/listings'  },
  { label: 'Editorial',    path: '/editorial' },
  { label: 'About Us',     path: '/about'     },
  { label: 'Contact',      path: '/contact'   },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Use',   path: '/terms'   },
];

const SOCIALS = [
  { label: 'Instagram', href: '#' },
  { label: 'Twitter',   href: '#' },
  { label: 'LinkedIn',  href: '#' },
];

export const Footer = () => (
  <footer className="relative bg-stayora-grey text-stayora-black mt-auto border-t border-stayora-black/[0.04] overflow-hidden z-10">
    {/* Main footer body */}
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 pb-28 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

        {/* Brand column */}
        <div className="md:col-span-4 space-y-6">
          <Link to="/" className="font-serif text-2xl tracking-[0.05em] text-stayora-black block">
            Stayora
          </Link>
          <p className="text-sm text-stayora-black/50 leading-relaxed max-w-xs font-sans">
            Discover villas, homes, and unique spaces for your next trip, without paying more than you need to.
          </p>
          {/* Social links */}
          <div className="flex items-center gap-5 pt-2">
            {SOCIALS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-[11px] font-sans font-bold text-stayora-black/40 hover:text-stayora-black transition-all duration-300 uppercase tracking-widest hover:underline underline-offset-4 decoration-stayora-black/30"
              >
                {label}
              </a>
            ))}
            <a
              href="mailto:hello@stayora.com"
              aria-label="Email"
              className="text-stayora-black/40 hover:text-stayora-black transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Spacer */}
        <div className="hidden md:block md:col-span-2" />

        {/* Explore column */}
        <div className="md:col-span-3 space-y-6">
          <span className="text-[10px] font-sans font-bold text-stayora-black/40 uppercase tracking-widest block">Explore</span>
          <ul className="space-y-3">
            {EXPLORE_LINKS.map(({ label, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className="text-sm text-stayora-black/50 hover:text-stayora-black transition-all duration-300 font-medium hover:underline underline-offset-4 decoration-stayora-black/30"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal column */}
        <div className="md:col-span-3 space-y-6">
          <span className="text-[10px] font-sans font-bold text-stayora-black/40 uppercase tracking-widest block">Legal</span>
          <ul className="space-y-3">
            {LEGAL_LINKS.map(({ label, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className="text-sm text-stayora-black/50 hover:text-stayora-black transition-all duration-300 font-medium hover:underline underline-offset-4 decoration-stayora-black/30"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>

    {/* Bottom strip */}
    <div className="border-t border-stayora-black/[0.04] relative z-10 bg-stayora-grey">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-xs text-stayora-black/40">
          © {new Date().getFullYear()} STAYORA. All rights reserved.
        </p>
        <p className="text-xs text-stayora-black/30 tracking-widest uppercase font-sans">
          Discover and book unique stays.
        </p>
      </div>
    </div>

    {/* ── 5. GIANT WATERMARK SERIF TYPOGRAPHY (Cercal House Vibe) ── */}
    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center select-none pointer-events-none overflow-hidden h-[18vw] leading-none z-0">
      <span className="font-serif text-[19vw] text-stayora-black/[0.03] uppercase tracking-wider translate-y-[22%]">
        Stayora
      </span>
    </div>
  </footer>
);
