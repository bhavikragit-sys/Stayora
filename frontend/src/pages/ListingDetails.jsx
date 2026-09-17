import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useListing, useListingReviews, useListingBookings } from '../hooks/useListings';
import { Button } from '../components/ui/Button';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { formatPrice } from '../lib/formatPrice';
import api from '../lib/api/axios';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { InlineCalendar } from '../components/ui/InlineCalendar';
import { NotFound } from './NotFound.jsx';

const ImageGallery = ({ images, title }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [animatingIndex, setAnimatingIndex] = useState(null);
  const [isFading, setIsFading] = useState(false);

  // Sync active index with animating index
  useEffect(() => {
    if (lightboxIndex !== null) {
      setAnimatingIndex(lightboxIndex);
    } else {
      setAnimatingIndex(null);
    }
  }, [lightboxIndex]);

  const triggerSlide = (nextIndex) => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      setLightboxIndex(nextIndex);
      setAnimatingIndex(nextIndex);
      setIsFading(false);
    }, 120); // Sync duration with transition
  };

  const handleNext = () => {
    if (!images) return;
    triggerSlide((lightboxIndex + 1) % images.length);
  };

  const handlePrev = () => {
    if (!images) return;
    triggerSlide((lightboxIndex - 1 + images.length) % images.length);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null || !images) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, images]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] md:aspect-[2/1] rounded-none overflow-hidden mb-12 bg-stayora-grey shadow-soft">
        <img src="https://via.placeholder.com/1200x600?text=No+Image" alt={title} className="w-full h-full object-cover" />
      </div>
    );
  }

  const renderGallery = () => {
    if (images.length === 1) {
      return (
        <div 
          onClick={() => setLightboxIndex(0)}
          className="aspect-[16/9] md:aspect-[2/1] rounded-none overflow-hidden mb-12 bg-stayora-grey shadow-soft cursor-pointer"
        >
          <img 
            src={images[0].url} 
            alt={title} 
            onLoad={(e) => e.target.classList.add('is-loaded')}
            className="reveal-image w-full h-full object-cover hover:scale-[1.01] transition-all duration-700" 
          />
        </div>
      );
    }
    
    if (images.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-2 md:gap-4 aspect-[16/9] md:aspect-[2/1] rounded-none overflow-hidden mb-12 shadow-soft bg-stayora-grey">
          <img onClick={() => setLightboxIndex(0)} src={images[0].url} alt={title} onLoad={(e) => e.target.classList.add('is-loaded')} className="reveal-image w-full h-full object-cover cursor-pointer hover:opacity-90 transition duration-500" />
          <img onClick={() => setLightboxIndex(1)} src={images[1].url} alt={title} onLoad={(e) => e.target.classList.add('is-loaded')} className="reveal-image w-full h-full object-cover cursor-pointer hover:opacity-90 transition duration-500" />
        </div>
      );
    }

    if (images.length === 3) {
      return (
        <div className="grid grid-cols-2 gap-2 md:gap-4 aspect-[16/9] md:aspect-[2/1] rounded-none overflow-hidden mb-12 shadow-soft bg-stayora-grey">
          <img onClick={() => setLightboxIndex(0)} src={images[0].url} alt={title} onLoad={(e) => e.target.classList.add('is-loaded')} className="reveal-image w-full h-full object-cover cursor-pointer hover:opacity-90 transition duration-500" />
          <div className="grid grid-rows-2 gap-2 md:gap-4 h-full">
             <img onClick={() => setLightboxIndex(1)} src={images[1].url} alt={title} onLoad={(e) => e.target.classList.add('is-loaded')} className="reveal-image w-full h-full object-cover cursor-pointer hover:opacity-90 transition duration-500" />
             <img onClick={() => setLightboxIndex(2)} src={images[2].url} alt={title} onLoad={(e) => e.target.classList.add('is-loaded')} className="reveal-image w-full h-full object-cover cursor-pointer hover:opacity-90 transition duration-500" />
          </div>
        </div>
      );
    }
    
    // 4 or more
    return (
      <div className="grid grid-cols-2 gap-2 md:gap-4 aspect-[16/9] md:aspect-[2/1] rounded-none overflow-hidden mb-12 shadow-soft bg-stayora-grey">
        <img onClick={() => setLightboxIndex(0)} src={images[0].url} alt={title} onLoad={(e) => e.target.classList.add('is-loaded')} className="reveal-image w-full h-full object-cover cursor-pointer hover:opacity-90 transition duration-500" />
        <div className="grid grid-cols-2 grid-rows-2 gap-2 md:gap-4 h-full">
           <img onClick={() => setLightboxIndex(1)} src={images[1].url} alt={title} onLoad={(e) => e.target.classList.add('is-loaded')} className="reveal-image w-full h-full object-cover cursor-pointer hover:opacity-90 transition duration-500" />
           <img onClick={() => setLightboxIndex(2)} src={images[2].url} alt={title} onLoad={(e) => e.target.classList.add('is-loaded')} className="reveal-image w-full h-full object-cover cursor-pointer hover:opacity-90 transition duration-500" />
           <img onClick={() => setLightboxIndex(3)} src={images[3].url} alt={title} onLoad={(e) => e.target.classList.add('is-loaded')} className="reveal-image w-full h-full object-cover cursor-pointer hover:opacity-90 transition duration-500" />
           <div className="relative h-full w-full cursor-pointer bg-stayora-grey" onClick={() => setLightboxIndex(4 || 3)}>
             <img src={images[4]?.url || images[3].url} alt={title} onLoad={(e) => e.target.classList.add('is-loaded')} className="reveal-image w-full h-full object-cover hover:opacity-90 transition duration-500" />
             {images.length > 5 && (
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/55 transition duration-300 z-10">
                 <span className="text-white font-bold text-lg md:text-xl">+{images.length - 5} photos</span>
               </div>
             )}
           </div>
        </div>
      </div>
    );
  };

  // Lock body scroll when Lightbox is active
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxIndex]);

  const activeIndexVal = animatingIndex !== null ? animatingIndex : lightboxIndex;

  return (
    <>
      {renderGallery()}

      {/* Fullscreen Lightbox Overlay */}
      {lightboxIndex !== null && createPortal(
        <div 
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-black/95 flex flex-col justify-between p-4 md:p-6 select-none animate-fade-in overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center text-white/60 text-sm">
            <span>{(lightboxIndex !== null ? lightboxIndex : 0) + 1} / {images.length}</span>
            <button 
              onClick={() => setLightboxIndex(null)}
              className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Active Image Box */}
          <div className="flex-1 flex items-center justify-center relative">
            {activeIndexVal !== null && (
              <img 
                src={images[activeIndexVal].url} 
                alt={`${title} fullscreen`}
                onClick={(e) => e.stopPropagation()}
                className={`max-h-[80vh] max-w-[90vw] object-contain mx-auto shadow-2xl rounded-none transition-all duration-120 ease-out ${
                  isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              />
            )}

            {/* Left Control */}
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                handlePrev();
              }}
              className="absolute left-2 md:left-6 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Right Control */}
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                handleNext();
              }}
              className="absolute right-2 md:right-6 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Footer dummy detail spacing */}
          <div className="text-center text-white/50 text-xs py-2">
            <span>Use Left & Right arrow keys to navigate. Esc to close.</span>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: listing, isLoading, error } = useListing(id);
  const { data: reviewsData, isLoading: reviewsLoading } = useListingReviews(id);
  const { data: bookings = [] } = useListingBookings(id);

  const { addToast } = useToast();

  const [confirmDeleteReviewId, setConfirmDeleteReviewId] = useState(null);
  const [isDeletingReview, setIsDeletingReview] = useState(false);

  // Dynamic page title
  useEffect(() => {
    if (listing?.title) document.title = `${listing.title} · STAYORA`;
    return () => { document.title = 'STAYORA'; };
  }, [listing?.title]);

  // Sticky mini-bar
  const [showMiniBar, setShowMiniBar] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowMiniBar(window.scrollY > 450);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [valError, setValError] = useState('');

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 pt-28 md:pt-32 animate-pulse space-y-8">
        <div className="h-10 bg-stayora-grey rounded w-1/3 mb-6"></div>
        <div className="aspect-[16/9] md:aspect-[2/1] bg-stayora-grey rounded-none mb-12 shadow-soft"></div>
      </div>
    );
  }

  // Handle 404 specifically (deleted or non-existent listing)
  const is404 = error?.response?.status === 404 || (!listing && !error);
  if (is404) {
    return (
      <NotFound
        title="Listing Not Found"
        description="The stay you are looking for doesn't exist, has been removed by the host, or is no longer available."
        actionText="Explore Stays"
        actionLink="/listings"
        secondaryActionText="Return Home"
        secondaryActionLink="/"
      />
    );
  }

  // Handle other unexpected errors (e.g. 500, network failure)
  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-16 pt-28 md:pt-32 max-w-xl mx-auto space-y-6 animate-fade-in-up">
        <span className="text-[11px] font-sans font-bold tracking-[0.25em] text-stayora-red uppercase block select-none">
          • Error Loading Listing •
        </span>
        <h1 className="font-serif text-4xl md:text-5xl text-stayora-black leading-tight">
          Unable to Load Listing
        </h1>
        <p className="text-stayora-black/65 text-base md:text-lg font-sans leading-relaxed">
          {error.response?.data?.message || 'Something went wrong while retrieving this stay. Please check your internet connection or try again.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
          <Button 
            variant="primary" 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['listings', id] })}
            className="w-full sm:w-auto min-w-[160px]"
          >
            Try Again
          </Button>
          <Link to="/listings" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto min-w-[160px]">
              Back to Stays
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleBook = () => {
    setValError('');
    const today = new Date();
    today.setHours(0,0,0,0);
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (!checkIn || !checkOut) {
      setValError('Please select both Check-in and Check-out dates.');
      return;
    }
    if (checkInDate < today) {
      setValError('Check-in date cannot be in the past.');
      return;
    }
    if (checkOutDate <= checkInDate) {
      setValError('Check-out date must be after Check-in date.');
      return;
    }
    const guestNum = Number(guests);
    if (isNaN(guestNum) || guestNum < 1) {
      setValError('Must have at least 1 guest.');
      return;
    }
    if (guestNum > listing.maxGuests) {
      setValError(`Maximum guests allowed is ${listing.maxGuests}.`);
      return;
    }
    
    navigate(`/listings/${id}/book`, { state: { checkIn, checkOut, guests: guestNum } });
  };

  const handleDeleteReview = (reviewId) => {
    setConfirmDeleteReviewId(reviewId);
  };

  const executeDeleteReview = async () => {
    const reviewId = confirmDeleteReviewId;
    setConfirmDeleteReviewId(null);
    setIsDeletingReview(true);
    try {
      await api.delete(`/api/reviews/${reviewId}`);
      queryClient.invalidateQueries({ queryKey: ['listing-reviews', id] });
      queryClient.invalidateQueries({ queryKey: ['listings', id] });
      addToast('Review deleted successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete review', 'error');
    } finally {
      setIsDeletingReview(false);
    }
  };

  // Determine host name. Backend doesn't populate owner on GET /:id, so it's just an ObjectId.
  // If the listing owner matches the logged in user, we show their name. 
  // Otherwise fallback to Stayora Host.
  const isOwner = user && (listing.owner === user._id || listing.owner?._id === user._id);
  const hostName = isOwner ? user.name : (listing.owner?.name || 'Stayora Host');

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 pt-28 md:pt-32">

      {/* ── Sticky mini booking bar ── */}
      <div
        className={`fixed top-20 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] transition-all duration-300 ${
          showMiniBar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 h-16 flex items-center justify-between gap-4">
          <span className="font-bold text-stayora-black text-sm md:text-base truncate flex-1">
            {listing.title}
          </span>
          <div className="flex items-center gap-4 shrink-0">
            <span className="font-bold text-stayora-black text-sm">
              {formatPrice(listing.pricePerNight)}
              <span className="text-stayora-black/50 font-normal ml-1 text-xs">/ night</span>
            </span>
            {!isOwner && (
              <button
                onClick={handleBook}
                className="bg-stayora-black text-white text-xs font-bold px-5 py-2.5 rounded-none hover:bg-stayora-black/85 transition-colors uppercase tracking-wider"
              >
                Book now ↗
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Header */}
      <div className="mb-10 space-y-2">
        <span className="text-[10px] font-sans font-bold text-stayora-black/45 uppercase tracking-widest block">
          • Stay Details
        </span>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stayora-black leading-tight tracking-tight select-none">
          {listing.title}
        </h1>
        <div className="flex items-center text-stayora-black/60 space-x-4 text-xs font-semibold uppercase tracking-wider">
          <span>{listing.location}</span>
          <span>•</span>
          <span>{listing.maxGuests || 2} Guests</span>
          {listing.reviewCount > 0 && (
            <>
              <span>•</span>
              <span className="flex items-center font-bold text-stayora-black">
                 ★ {listing.averageRating} ({listing.reviewCount} {listing.reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </>
          )}
        </div>
      </div>

      {/* Dynamic Image Gallery */}
      <ImageGallery images={listing.images} title={listing.title} />

      {/* Content Split */}
      <div className="flex flex-col lg:flex-row gap-12 relative">
        {/* Main Content */}
        <div className="flex-1 space-y-12">
          <section>
            <h2 className="font-editorial text-2xl lg:text-3xl font-medium text-stayora-black border-b border-[#E5E5E5]/60 pb-3 mb-5">
              About this space
            </h2>
            <p className="text-stayora-black/80 leading-relaxed text-base whitespace-pre-wrap">
              {listing.description || 'No description provided.'}
            </p>
          </section>

          {/* Host Info */}
          <section className="border-t border-[#E5E5E5] pt-8">
            <h2 className="font-editorial text-2xl lg:text-3xl font-medium text-stayora-black border-b border-[#E5E5E5]/60 pb-3 mb-5">
              Hosted by <Link to={`/users/${listing.owner?._id || listing.owner}`} className="underline hover:text-stayora-red transition-colors">{hostName}</Link>
            </h2>
            <p className="text-stayora-black/70 text-sm">{isOwner ? 'You created this listing' : 'Joined recently'}</p>
          </section>

          {/* Reviews */}
          <section className="border-t border-[#E5E5E5] pt-8">
            <h2 className="font-editorial text-2xl lg:text-3xl font-medium text-stayora-black border-b border-[#E5E5E5]/60 pb-3 mb-6">
              Reviews {listing.reviewCount > 0 && `(★ ${listing.averageRating})`}
            </h2>
            
            {reviewsLoading ? (
              <div className="text-stayora-black/50">Loading reviews...</div>
            ) : !reviewsData?.reviews || reviewsData.reviews.length === 0 ? (
              <div className="text-stayora-black/70">No reviews yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviewsData.reviews.map(review => {
                  const authorName = review.author?.name || 'Stayora Guest';
                  const isAuthor = user && (review.author === user._id || review.author?._id === user._id);
                  return (
                    <div key={review._id} className="space-y-2 border-b border-[#F5F5F5] pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-stayora-black block">{authorName}</span>
                          <span className="text-xs text-stayora-black/50">{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-stayora-black font-semibold">★ {review.rating}</span>
                          {isAuthor && (
                            <button 
                              onClick={() => handleDeleteReview(review._id)} 
                              className="text-stayora-red hover:underline text-xs font-semibold pl-2 border-l border-[#E5E5E5]"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-stayora-black/80 leading-relaxed text-sm">{review.comment}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Booking Panel */}
        <div className="w-full lg:w-[400px]">
          <div className="sticky top-28 bg-white border border-[#E5E5E5] rounded-none p-6 shadow-soft flex flex-col space-y-6">
            <div className="flex justify-between items-baseline border-b border-[#E5E5E5] pb-4">
              <div>
                <span className="text-3xl font-bold text-stayora-black">{formatPrice(listing.pricePerNight)}</span>
              </div>
              <span className="text-stayora-black/70">/ night</span>
            </div>
            
            {isOwner ? (
              <div className="space-y-4">
                <p className="text-sm text-stayora-black/70 text-center">This is your property listing.</p>
                <Button variant="secondary" className="w-full text-lg py-4" onClick={() => navigate(`/dashboard/listings/${listing._id}/edit`)}>
                  Edit your listing
                </Button>
              </div>
            ) : (
              <>
                {valError && (
                  <div className="p-3 bg-stayora-red/10 text-stayora-red rounded-none text-xs font-semibold">
                    {valError}
                  </div>
                )}
                
                <div className="space-y-4">
                   <div className="flex gap-2">
                     <div className="flex-1 border border-[#E5E5E5] rounded-none p-3 bg-stayora-grey/30 text-left">
                        <label className="text-[10px] font-sans font-bold text-stayora-black uppercase tracking-wider mb-1 block">Check-in</label>
                        <div className="text-xs font-semibold text-stayora-black">
                          {checkIn || 'Select Date'}
                        </div>
                     </div>
                     <div className="flex-1 border border-[#E5E5E5] rounded-none p-3 bg-stayora-grey/30 text-left">
                        <label className="text-[10px] font-sans font-bold text-stayora-black uppercase tracking-wider mb-1 block">Check-out</label>
                        <div className="text-xs font-semibold text-stayora-black">
                          {checkOut || 'Select Date'}
                        </div>
                     </div>
                   </div>

                   <InlineCalendar 
                     checkIn={checkIn}
                     checkOut={checkOut}
                     bookings={bookings}
                     onChange={({ checkIn, checkOut }) => {
                       setCheckIn(checkIn);
                       setCheckOut(checkOut);
                     }}
                   />

                   <div className="border border-[#E5E5E5] rounded-none p-3 bg-stayora-grey/30 text-left">
                      <label htmlFor="guests" className="text-[10px] font-sans font-bold text-stayora-black uppercase tracking-wider mb-1 block">Guests</label>
                      <input 
                        type="text" 
                        id="guests" 
                        value={guests} 
                        onChange={e => setGuests(e.target.value)} 
                        placeholder="1"
                        className="bg-transparent text-stayora-black/70 w-full focus:outline-none text-sm font-semibold"
                      />
                   </div>
                </div>

                <Button variant="primary" className="w-full text-lg py-4" onClick={handleBook}>
                  BOOK
                </Button>
                <p className="text-center text-sm text-stayora-black/50">You won't be charged yet</p>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmDeleteReviewId !== null}
        onConfirm={executeDeleteReview}
        onCancel={() => setConfirmDeleteReviewId(null)}
        title="Delete This Review?"
        message="Are you sure you want to delete your review? This cannot be undone."
        confirmLabel="Delete Review"
        isDanger
        isLoading={isDeletingReview}
      />
    </div>
  );
};
