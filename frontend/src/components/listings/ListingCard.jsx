import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice } from '../../lib/formatPrice';

export const ListingCard = ({ listing }) => {
  const title = listing.title || 'Untitled Listing';
  const location = listing.location || 'Unknown Location';
  const price = listing.pricePerNight || 0;
  
  // Extract all images or fallback to default
  const images = listing.images && listing.images.length > 0 
    ? listing.images 
    : [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop' }];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [activeIndex]);

  // Next image handler
  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  // Previous image handler
  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Check if rating should be shown based on actual reviews in database
  const hasReviews = listing.reviewCount > 0 && listing.averageRating;
  const ratingVal = hasReviews ? Number(listing.averageRating).toFixed(1) : null;

  return (
    <Link to={`/listings/${listing._id}`} className="group block cursor-pointer text-left">
      <div className="flex flex-col space-y-3">
        
        {/* Aspect 4:3 Image Container with Carousel controls */}
        <div className="relative aspect-[4/3] overflow-hidden bg-stayora-grey rounded-none shadow-sm group/carousel">
          <img 
            src={images[activeIndex].url} 
            alt={`${title} image ${activeIndex}`} 
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
              isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-[1.03] blur-md'
            }`}
          />
          {/* Subtle cinematic gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-[1]" />

          {/* Left/Right floating controls (visible on card/carousel hover) */}
          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white text-stayora-black flex items-center justify-center rounded-full shadow-soft transition-all duration-300 md:opacity-0 group-hover/carousel:opacity-100 border border-[#E5E5E5]/50 z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white text-stayora-black flex items-center justify-center rounded-full shadow-soft transition-all duration-300 md:opacity-0 group-hover/carousel:opacity-100 border border-[#E5E5E5]/50 z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Carousel line indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 z-10 overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${((activeIndex + 1) / images.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="flex flex-col space-y-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform group-hover:-translate-y-[3px]">
          {/* Title & Rating row */}
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-stayora-black/80 group-hover:text-stayora-black text-[15px] md:text-base line-clamp-1 pr-4 transition-colors duration-500">{title}</h3>
            {ratingVal && (
              <span className="text-xs font-bold text-stayora-red shrink-0 flex items-center gap-0.5 transition-transform duration-500 group-hover:scale-105">
                <span>★</span>
                <span>{ratingVal}</span>
              </span>
            )}
          </div>

          {/* Location */}
          <p className="text-stayora-black/45 group-hover:text-stayora-black/65 text-xs md:text-sm line-clamp-1 transition-colors duration-500">{location}</p>

          {/* Pricing */}
          <div className="pt-1 flex items-center space-x-1">
            <span className="font-bold text-stayora-red text-sm md:text-base transition-colors duration-500">
              {formatPrice(price)}
            </span>
            <span className="text-xs text-stayora-black/45 group-hover:text-stayora-black/60 font-medium transition-colors duration-500">/ night</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ListingCardSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3">
      {/* 4:3 Rounded Image Skeleton */}
      <div className="aspect-[4/3] rounded-none shimmer-bg w-full"></div>
      
      {/* Detail row skeletons */}
      <div className="space-y-2 text-left">
        <div className="flex justify-between items-center">
          <div className="h-4 shimmer-bg w-2/3 rounded-none"></div>
          <div className="h-3 shimmer-bg w-1/12 rounded-none"></div>
        </div>
        <div className="h-3.5 shimmer-bg w-1/3 rounded-none"></div>
        <div className="h-4 shimmer-bg w-1/4 rounded-none mt-1"></div>
      </div>
    </div>
  );
};
