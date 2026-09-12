import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useListings } from '../hooks/useListings';
import { ListingCard, ListingCardSkeleton } from '../components/listings/ListingCard';
import { Button } from '../components/ui/Button';
import {
  Search, SlidersHorizontal, X, MapPin, Star,
  DollarSign, ChevronLeft, ChevronRight, AlertCircle,
  Globe, Users, Telescope
} from 'lucide-react';

// ─── Active Filter Chip ───────────────────────────────────────────────────────
const FilterChip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 bg-stayora-black text-white text-xs font-semibold px-3 py-1.5 rounded-full">
    {label}
    <button
      onClick={onRemove}
      className="hover:opacity-70 transition-opacity ml-0.5"
      aria-label={`Remove ${label} filter`}
    >
      <X className="w-3 h-3" />
    </button>
  </span>
);

// ─── Price Range Input Component ─────────────────────────────────────────────
const PriceRangeInput = ({ minPrice, maxPrice, onMinChange, onMaxChange }) => (
  <div className="space-y-3">
    <label className="text-[11px] font-sans font-bold text-stayora-black/50 uppercase tracking-widest block">
      Price per Night (INR)
    </label>
    <div className="grid grid-cols-2 gap-3">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stayora-black/40 text-sm font-semibold">₹</span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => onMinChange(e.target.value.replace(/[^0-9]/g, ''))}
          className="w-full pl-7 pr-3 py-2.5 bg-stayora-grey/60 border border-[#E5E5E5] rounded-none text-sm font-semibold text-stayora-black focus:outline-none focus:border-stayora-black transition-colors placeholder-stayora-black/25"
        />
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stayora-black/40 text-sm font-semibold">₹</span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => onMaxChange(e.target.value.replace(/[^0-9]/g, ''))}
          className="w-full pl-7 pr-3 py-2.5 bg-stayora-grey/60 border border-[#E5E5E5] rounded-none text-sm font-semibold text-stayora-black focus:outline-none focus:border-stayora-black transition-colors placeholder-stayora-black/25"
        />
      </div>
    </div>
    {/* Quick price presets */}
    <div className="flex flex-wrap gap-2 pt-1">
      {[['Under ₹2,000', '', '2000'], ['₹2,000–₹5,000', '2000', '5000'], ['₹5,000–₹10,000', '5000', '10000'], ['₹10,000+', '10000', '']].map(([label, min, max]) => (
        <button
          key={label}
          onClick={() => { onMinChange(min); onMaxChange(max); }}
          className={`text-[11px] font-semibold px-2.5 py-1 border transition-all
            ${minPrice === min && maxPrice === max
              ? 'bg-stayora-black text-white border-stayora-black'
              : 'bg-transparent text-stayora-black/60 border-[#E5E5E5] hover:border-stayora-black/50 hover:text-stayora-black'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  </div>
);

// ─── Rating Selector ──────────────────────────────────────────────────────────
const RatingSelector = ({ rating, onChange }) => (
  <div className="space-y-3">
    <label className="text-[11px] font-bold text-stayora-black/50 uppercase tracking-widest block">
      Minimum Rating
    </label>
    <div className="flex gap-2">
      {[0, 3, 3.5, 4, 4.5].map((val) => (
        <button
          key={val}
          onClick={() => onChange(rating === String(val) ? '' : String(val))}
          className={`flex-1 py-2 text-xs font-bold border transition-all
            ${rating === String(val)
              ? 'bg-stayora-black text-white border-stayora-black'
              : 'bg-transparent text-stayora-black/60 border-[#E5E5E5] hover:border-stayora-black/50 hover:text-stayora-black'
            }`}
        >
          {val === 0 ? 'Any' : `★ ${val}+`}
        </button>
      ))}
    </div>
  </div>
);

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({ page, totalPages, onPageChange }) => {
  const pages = [];
  const delta = 2;
  const left = Math.max(2, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  pages.push(1);
  if (left > 2) pages.push('...');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="flex justify-center items-center gap-2 pt-16 pb-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="h-10 px-4 flex items-center justify-center border border-[#E5E5E5]/60 text-[10px] font-sans font-bold uppercase tracking-widest text-stayora-black disabled:opacity-20 hover:border-stayora-black active:translate-y-0.5 transition-all duration-300 disabled:cursor-not-allowed select-none"
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {pages.map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-stayora-black/30 text-xs font-semibold select-none">
            ···
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 flex items-center justify-center text-xs font-bold transition-all duration-300 select-none
              ${p === page
                ? 'bg-stayora-black text-white border border-stayora-black'
                : 'text-stayora-black/55 border border-[#E5E5E5]/60 hover:border-stayora-black hover:text-stayora-black hover:bg-stayora-grey/30'
              }`}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="h-10 px-4 flex items-center justify-center border border-[#E5E5E5]/60 text-[10px] font-sans font-bold uppercase tracking-widest text-stayora-black disabled:opacity-20 hover:border-stayora-black active:translate-y-0.5 transition-all duration-300 disabled:cursor-not-allowed select-none"
        aria-label="Next page"
      >
        Next →
      </button>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = ({ hasFilters, onClear }) => (
  <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
    <div className="w-20 h-20 rounded-full bg-stayora-grey flex items-center justify-center mb-6">
      <Telescope className="w-9 h-9 text-stayora-black/30" />
    </div>
    <h3 className="text-xl font-bold text-stayora-black mb-2">No stays found</h3>
    <p className="text-stayora-black/50 text-sm max-w-xs leading-relaxed mb-6">
      {hasFilters
        ? "We couldn't find any stays matching your filters. Try adjusting or clearing them."
        : "There are no listings available right now. Check back soon!"}
    </p>
    {hasFilters && (
      <button
        onClick={onClear}
        className="text-sm font-bold underline underline-offset-4 text-stayora-black hover:text-stayora-red transition-colors"
      >
        Clear all filters
      </button>
    )}
  </div>
);

// ─── Error State ──────────────────────────────────────────────────────────────
const ErrorState = () => (
  <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-6">
      <AlertCircle className="w-9 h-9 text-stayora-red" />
    </div>
    <h3 className="text-xl font-bold text-stayora-black mb-2">Something went wrong</h3>
    <p className="text-stayora-black/50 text-sm max-w-xs leading-relaxed mb-6">
      We had trouble loading stays. Please check your connection and try again.
    </p>
    <button
      onClick={() => window.location.reload()}
      className="text-sm font-bold underline underline-offset-4 text-stayora-black hover:text-stayora-red transition-colors"
    >
      Try again
    </button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Draft state (not yet submitted) ──
  const [draftLocation, setDraftLocation] = useState(searchParams.get('location') || '');
  const [draftCountry, setDraftCountry] = useState(searchParams.get('country') || '');
  const [draftMinPrice, setDraftMinPrice] = useState(searchParams.get('minPrice') || '');
  const [draftMaxPrice, setDraftMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [draftRating, setDraftRating] = useState(searchParams.get('rating') || '');

  // ── Committed (live) filter state ──
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [country, setCountry] = useState(searchParams.get('country') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');
  const [page, setPage] = useState(1);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterPanelRef = useRef(null);
  const searchInputRef = useRef(null);

  // Sync all filters from URL on searchParams change (handling back/forward or deep links)
  useEffect(() => {
    const urlLoc = searchParams.get('location') || '';
    const urlCountry = searchParams.get('country') || '';
    const urlMinPrice = searchParams.get('minPrice') || '';
    const urlMaxPrice = searchParams.get('maxPrice') || '';
    const urlRating = searchParams.get('rating') || '';

    setLocation(urlLoc);
    setDraftLocation(urlLoc);
    
    setCountry(urlCountry);
    setDraftCountry(urlCountry);

    setMinPrice(urlMinPrice);
    setDraftMinPrice(urlMinPrice);

    setMaxPrice(urlMaxPrice);
    setDraftMaxPrice(urlMaxPrice);

    setRating(urlRating);
    setDraftRating(urlRating);

    setPage(1);
  }, [searchParams]);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close panel on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsFilterOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Commit search ──
  const handleSearch = useCallback(() => {
    const newParams = {};
    if (draftLocation) newParams.location = draftLocation;
    if (draftCountry) newParams.country = draftCountry;
    if (draftMinPrice) newParams.minPrice = draftMinPrice;
    if (draftMaxPrice) newParams.maxPrice = draftMaxPrice;
    if (draftRating) newParams.rating = draftRating;
    setSearchParams(newParams);
    setIsFilterOpen(false);
  }, [draftLocation, draftCountry, draftMinPrice, draftMaxPrice, draftRating, setSearchParams]);

  // Submit on Enter in location input
  const handleLocationKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // ── Clear all filters ──
  const handleClearFilters = () => {
    setSearchParams({});
    setIsFilterOpen(false);
  };

  // ── API params ──
  const apiParams = { page, limit: 8 };
  if (location) apiParams.location = location;
  if (country) apiParams.country = country;
  if (minPrice) apiParams.minPrice = Number(minPrice);
  if (maxPrice) apiParams.maxPrice = Number(maxPrice);
  if (rating) apiParams.rating = Number(rating);

  const { data, isLoading, error, isFetching } = useListings(apiParams);
  const pagination = data?.pagination || {};

  // ── Active filter chips ──
  const activeFilters = [
    country && { 
      key: 'country', 
      label: `Country: ${country}`, 
      onRemove: () => { 
        setSearchParams(p => {
          const next = new URLSearchParams(p);
          next.delete('country');
          return next;
        }); 
      } 
    },
    (minPrice || maxPrice) && {
      key: 'price',
      label: minPrice && maxPrice 
        ? `₹${minPrice}–₹${maxPrice}` 
        : minPrice 
          ? `From ₹${minPrice}` 
          : `Up to ₹${maxPrice}`,
      onRemove: () => { 
        setSearchParams(p => { 
          const next = new URLSearchParams(p);
          next.delete('minPrice'); 
          next.delete('maxPrice'); 
          return next; 
        }); 
      }
    },
    rating && { 
      key: 'rating', 
      label: `★ ${rating}+ Rating`, 
      onRemove: () => { 
        setSearchParams(p => {
          const next = new URLSearchParams(p);
          next.delete('rating');
          return next;
        }); 
      } 
    },
  ].filter(Boolean);

  const hasActiveFilters = activeFilters.length > 0;
  const totalResults = pagination.total;

  return (
    <div className="w-full min-h-screen bg-stayora-white pt-20">

      {/* ── Search Hero ─────────────────────────────────────────────────── */}
      <div className="bg-stayora-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">

          <div className="text-center mb-12 space-y-3">
            <span className="text-[10px] font-sans font-bold text-stayora-black/45 uppercase tracking-widest block">
              • Our Collection
            </span>
            <h1 className="font-serif text-5xl md:text-6xl text-stayora-black tracking-tight font-normal leading-none select-none">
              Explore Stays
            </h1>
            <p className="text-stayora-black/55 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Find unique stays, villas, and rooms in destinations around the globe.
            </p>
          </div>

          {/* ── Airbnb-style Search Bar ── */}
          <div className="flex justify-center" ref={filterPanelRef}>
            <div className="w-full max-w-3xl">

              {/* Main pill */}
              <div className="flex items-stretch bg-white border border-[#DDDDDD] rounded-full shadow-[0_2px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.18)] transition-shadow overflow-hidden">

                {/* Destination */}
                <div className="flex-1 flex flex-col justify-center px-6 py-3.5 min-w-0 border-r border-[#DDDDDD]">
                  <label className="text-[10px] font-bold text-stayora-black uppercase tracking-widest mb-0.5">
                    Where
                  </label>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search destinations..."
                    value={draftLocation}
                    onChange={(e) => setDraftLocation(e.target.value)}
                    onKeyDown={handleLocationKeyDown}
                    className="bg-transparent text-stayora-black text-sm font-semibold focus:outline-none placeholder-stayora-black/30 w-full"
                    aria-label="Search by destination"
                  />
                </div>

                {/* Country — hidden on small screens */}
                <div className="hidden md:flex flex-col justify-center px-5 py-3.5 border-r border-[#DDDDDD] min-w-[140px]">
                  <label className="text-[10px] font-bold text-stayora-black uppercase tracking-widest mb-0.5">
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="Any country"
                    value={draftCountry}
                    onChange={(e) => setDraftCountry(e.target.value)}
                    onKeyDown={handleLocationKeyDown}
                    className="bg-transparent text-stayora-black text-sm font-semibold focus:outline-none placeholder-stayora-black/30 w-full"
                    aria-label="Filter by country"
                  />
                </div>

                {/* Filters button */}
                <button
                  type="button"
                  onClick={() => setIsFilterOpen((v) => !v)}
                  className={`flex items-center gap-2 px-5 py-3.5 border-r border-[#DDDDDD] text-sm font-semibold transition-colors whitespace-nowrap
                    ${hasActiveFilters ? 'text-stayora-red' : 'text-stayora-black/70 hover:text-stayora-black'}`}
                  aria-expanded={isFilterOpen}
                  aria-label="Open advanced filters"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-stayora-red" />
                  )}
                </button>

                {/* Search button */}
                <button
                  type="button"
                  onClick={handleSearch}
                  className="bg-stayora-red hover:bg-[#c9201a] text-white flex items-center gap-2 px-6 py-3.5 font-bold text-sm transition-colors rounded-r-full"
                  aria-label="Search listings"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>

              {/* ── Dropdown Filter Panel ── */}
              <div className="relative z-50 mt-3">
                <div 
                  className={`absolute left-0 right-0 bg-white border border-[#E5E5E5] rounded-none shadow-[0_16px_48px_rgba(0,0,0,0.08)] p-8 space-y-6 max-h-[70vh] overflow-y-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isFilterOpen 
                      ? 'opacity-100 translate-y-0 pointer-events-auto visible' 
                      : 'opacity-0 -translate-y-4 pointer-events-none invisible'
                  }`}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-[#F5F5F5] text-left">
                    <div>
                      <span className="text-[9px] font-sans font-bold text-stayora-black/45 uppercase tracking-widest block mb-0.5">
                        • Filter Results
                      </span>
                      <h2 className="font-serif text-2xl text-stayora-black tracking-tight leading-tight select-none">
                        Refine Stays
                      </h2>
                    </div>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="w-9 h-9 border border-[#E5E5E5] rounded-none hover:bg-stayora-grey flex items-center justify-center transition-colors"
                      aria-label="Close filters"
                    >
                      <X className="w-4 h-4 text-stayora-black" />
                    </button>
                  </div>

                  {/* Country (visible on mobile in panel) */}
                  <div className="md:hidden space-y-2 text-left">
                    <label className="text-[10px] font-sans font-bold text-stayora-black/50 uppercase tracking-widest flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" /> Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Italy, Japan..."
                      value={draftCountry}
                      onChange={(e) => setDraftCountry(e.target.value)}
                      className="w-full px-4 py-2.5 bg-stayora-grey/60 border border-[#E5E5E5] rounded-none text-sm font-semibold text-stayora-black focus:outline-none focus:border-stayora-black transition-colors placeholder-stayora-black/25"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Price */}
                    <PriceRangeInput
                      minPrice={draftMinPrice}
                      maxPrice={draftMaxPrice}
                      onMinChange={setDraftMinPrice}
                      onMaxChange={setDraftMaxPrice}
                    />

                    {/* Rating */}
                    <RatingSelector rating={draftRating} onChange={setDraftRating} />
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-[#F5F5F5]">
                    <button
                      onClick={() => {
                        setDraftCountry(''); setDraftMinPrice(''); setDraftMaxPrice(''); setDraftRating('');
                      }}
                      className="text-[10px] font-sans font-bold text-stayora-black/40 hover:text-stayora-red uppercase tracking-widest transition-colors"
                    >
                      Clear all
                    </button>
                    <button
                      onClick={handleSearch}
                      className="inline-flex items-center justify-center gap-2 bg-stayora-black text-white hover:bg-transparent hover:text-stayora-black font-sans text-xs font-bold uppercase tracking-[0.2em] hover:tracking-[0.26em] hover:-translate-y-[1px] active:translate-y-0 rounded-none border border-stayora-black px-6 py-3.5 transition-all duration-300 ease-out"
                    >
                      <Search className="w-3.5 h-3.5" />
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Chips & Result Count ──────────────────────────────────── */}
      {(hasActiveFilters || location || (totalResults !== undefined)) && (
        <div className="border-b border-[#E5E5E5] bg-stayora-white/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-3 flex flex-wrap items-center gap-2.5">

            {/* Active filter chips */}
            {location && (
              <FilterChip
                label={`"${location}"`}
                onRemove={() => {
                  setDraftLocation(''); setLocation('');
                  setSearchParams(p => { p.delete('location'); return p; });
                  setPage(1);
                }}
              />
            )}
            {activeFilters.map((f) => (
              <FilterChip key={f.key} label={f.label} onRemove={f.onRemove} />
            ))}

            {/* Clear all */}
            {(hasActiveFilters || location) && (
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-stayora-black/50 hover:text-stayora-black underline underline-offset-2 transition-colors ml-1"
              >
                Clear all
              </button>
            )}

            {/* Result count — pushed to right */}
            {!isLoading && totalResults !== undefined && (
              <span className="ml-auto text-xs text-stayora-black/45 font-medium whitespace-nowrap">
                {totalResults.toLocaleString()} {totalResults === 1 ? 'stay' : 'stays'} found
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Listings Grid ────────────────────────────────────────────────── */}
      <div id="listings-start" className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">

        {isLoading ? (
          /* Loading skeleton grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {Array.from({ length: 8 }).map((_, n) => (
              <ListingCardSkeleton key={n} />
            ))}
          </div>

        ) : error ? (
          <ErrorState />

        ) : !data?.items || data.items.length === 0 ? (
          <EmptyState
            hasFilters={hasActiveFilters || !!location}
            onClear={handleClearFilters}
          />

        ) : (
          <div>
            {/* Results header */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-stayora-black/50 font-medium">
                {location
                  ? `Stays in "${location}"`
                  : 'All Stays'}
                {pagination.totalPages > 1 && (
                  <span className="text-stayora-black/30"> · Page {pagination.page} of {pagination.totalPages}</span>
                )}
              </p>
            </div>

            {/* Cards */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 transition-all duration-300 ${isFetching ? 'opacity-40 pointer-events-none blur-[0.3px]' : 'opacity-100'}`}>
              {data.items.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={pagination.totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  // Scroll smoothly to start of listings grid (just under header hero)
                  document.getElementById('listings-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
