import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api/axios';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatPrice } from '../lib/formatPrice';
import { useToast } from '../context/ToastContext';

export const Bookings = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [cancelError, setCancelError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [successListingTitle, setSuccessListingTitle] = useState('');

  useEffect(() => {
    if (location.state?.bookingSuccess) {
      setShowSuccessOverlay(true);
      setSuccessListingTitle(location.state.listingTitle);
      navigate('/bookings', { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (showSuccessOverlay) {
      const timer = setTimeout(() => {
        setShowSuccessOverlay(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessOverlay]);

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Lock body scroll when review modal is open
  useEffect(() => {
    if (reviewBooking) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [reviewBooking]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const res = await api.get('/api/bookings/me');
      return res.data.bookings || [];
    }
  });

  const executeCancel = async () => {
    const bookingId = confirmCancelId;
    setConfirmCancelId(null);
    setCancelError('');
    setCancellingId(bookingId);
    try {
      await api.patch(`/api/bookings/${bookingId}/cancel`);
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      addToast('Booking cancelled successfully', 'success');
    } catch (err) {
      setCancelError(err.response?.data?.message || 'Failed to cancel booking.');
      addToast('Failed to cancel booking', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!comment.trim()) {
      setReviewError('Please write a comment before submitting your review.');
      return;
    }
    setIsSubmittingReview(true);
    try {
      await api.post(`/api/listings/${reviewBooking.listing._id}/reviews`, {
        bookingId: reviewBooking._id,
        rating: Number(rating),
        comment
      });
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      setReviewBooking(null);
      setComment('');
      setRating(5);
      addToast('Thank you! Your review has been submitted.', 'success');
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
      addToast('Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-6 py-16 text-stayora-black/50">Loading your bookings...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto px-6 py-16 text-stayora-red font-bold">Failed to load bookings.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pt-28 md:pt-32">
      <div className="mb-10 space-y-2 text-left">
        <span className="text-[10px] font-sans font-bold text-stayora-black/45 uppercase tracking-widest block">
          • Trips
        </span>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stayora-black leading-tight tracking-tight select-none">
          My Bookings
        </h1>
      </div>

      {cancelError && (
        <div className="p-4 mb-6 bg-stayora-red/10 text-stayora-red rounded-control text-sm font-semibold">
          {cancelError}
        </div>
      )}

      {data.length === 0 ? (
        <div className="bg-stayora-grey/50 p-12 rounded-none text-center border border-[#E5E5E5]/50">
          <p className="text-lg text-stayora-black/70 mb-4 font-serif">You have no upcoming or past trips.</p>
        </div>
      ) : (
        <div className="space-y-6 text-left">
          {data.map((booking) => {
            const listing = booking.listing || {};
            const isCancelled = booking.status === 'cancelled';
            
            const checkInDate = new Date(booking.checkIn);
            const checkOutDate = new Date(booking.checkOut);
            
            const today = new Date();
            today.setHours(0,0,0,0);

            const checkInLocalMidnight = new Date(checkInDate);
            checkInLocalMidnight.setHours(0,0,0,0);

            const checkOutLocalMidnight = new Date(checkOutDate);
            checkOutLocalMidnight.setHours(0,0,0,0);
            
            const canCancel = !isCancelled && checkInLocalMidnight >= today;
            const isCompleted = !isCancelled && checkOutLocalMidnight < today;
            
            const imageUrl = listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop';

            const statusText = isCancelled ? 'Cancelled' : isCompleted ? 'Completed' : 'Confirmed';
            const statusColor = isCancelled 
              ? 'text-stayora-red' 
              : isCompleted 
                ? 'text-stayora-black/60' 
                : 'text-emerald-700';
            const dotColor = isCancelled 
              ? 'bg-stayora-red' 
              : isCompleted 
                ? 'bg-stayora-black/35' 
                : 'bg-emerald-600';

            return (
              <div 
                key={booking._id} 
                className={`py-8 flex flex-col md:flex-row gap-6 items-start md:items-center border-b border-[#E5E5E5]/50 last:border-b-0 relative transition-all duration-300 hover:border-stayora-black/30 ${isCancelled ? 'opacity-60' : ''}`}
              >
                {/* Image */}
                <div className="w-full md:w-32 h-32 rounded-none overflow-hidden bg-stayora-grey flex-shrink-0">
                  <img src={imageUrl} alt={listing.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-stayora-black text-xl line-clamp-1 font-serif">{listing.title || 'Deleted Listing'}</h3>
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest shrink-0 ${statusColor}`}>
                      <span className={`w-1 h-1 rounded-full ${dotColor}`} />
                      <span>{statusText}</span>
                    </span>
                  </div>
                  <p className="text-sm text-stayora-black/55">{listing.location || 'Unknown Location'}, {listing.country || 'Unknown Country'}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-[#E5E5E5]/50 mt-4">
                    <div>
                      <span className="block text-[10px] font-bold text-stayora-black/40 uppercase tracking-wider mb-0.5">Trip dates</span>
                      <span className="text-sm text-stayora-black/80 font-semibold">{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-stayora-black/40 uppercase tracking-wider mb-0.5">Guests</span>
                      <span className="text-sm text-stayora-black/80 font-semibold">{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-stayora-black/40 uppercase tracking-wider mb-0.5">Total Price</span>
                      <span className="text-sm text-stayora-black font-bold text-lg font-serif">{formatPrice(booking.totalPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full md:w-auto md:self-end flex flex-col gap-2 mt-4 md:mt-0">
                  {canCancel && (
                    <Button 
                      variant="secondary" 
                      onClick={() => setConfirmCancelId(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="w-full md:w-auto text-stayora-red border-stayora-red hover:bg-stayora-red hover:text-white"
                    >
                      {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                    </Button>
                  )}
                  {isCompleted && !booking.isReviewed && (
                    <Button 
                      variant="primary" 
                      onClick={() => setReviewBooking(booking)}
                      className="w-full md:w-auto"
                    >
                      Write Review
                    </Button>
                  )}
                  {isCompleted && booking.isReviewed && (
                    <span className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-none select-none">
                      ✓ Review Submitted
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewBooking && createPortal(
        <div className="fixed inset-0 top-0 left-0 w-screen h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] overflow-y-auto animate-fade-in">
          <div className="bg-white border border-[#E5E5E5]/50 rounded-none p-8 max-w-md w-full shadow-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-stayora-black tracking-tight">Write a Review</h2>
              <p className="text-sm text-stayora-black/70 mt-1">Share your experience at {reviewBooking.listing.title}</p>
            </div>

            {reviewError && (
              <div className="p-3 bg-stayora-red/10 text-stayora-red rounded-control text-sm font-semibold">
                {reviewError}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-semibold text-stayora-black">Rating</label>
                <select 
                  value={rating} 
                  onChange={e => setRating(Number(e.target.value))}
                  className="bg-stayora-grey border border-[#E5E5E5] rounded-control px-4 py-3 text-stayora-black focus:outline-none focus:border-stayora-black transition-colors"
                >
                  <option value={5}>★★★★★ (5 - Excellent)</option>
                  <option value={4}>★★★★☆ (4 - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 - Good)</option>
                  <option value={2}>★★☆☆☆ (2 - Fair)</option>
                  <option value={1}>★☆☆☆☆ (1 - Poor)</option>
                </select>
              </div>

              <Textarea 
                label="Comment"
                value={comment} 
                onChange={e => setComment(e.target.value)}
                placeholder="What did you love or think could be improved?"
                rows={4}
              />

              <div className="flex justify-end gap-4 pt-4 border-t border-[#E5E5E5]/50">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => setReviewBooking(null)} 
                  disabled={isSubmittingReview}
                  className="min-h-0 h-10 px-4"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={isSubmittingReview}
                  className="min-h-0 h-10 px-6"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      <ConfirmModal
        isOpen={confirmCancelId !== null}
        onConfirm={executeCancel}
        onCancel={() => setConfirmCancelId(null)}
        title="Cancel This Booking?"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmLabel="Yes, Cancel Booking"
        isDanger
        isLoading={cancellingId !== null}
      />

      {/* Fullscreen Booking Success Overlay */}
      {showSuccessOverlay && createPortal(
        <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] bg-white flex items-center justify-center select-none animate-fade-in text-center p-6">
          <div className="flex flex-col items-center justify-center space-y-4 max-w-xl animate-fade-in-up">
            <span className="text-xs font-bold text-stayora-red uppercase tracking-widest">STAYORA</span>
            <h2 className="text-4xl md:text-5xl font-bold text-stayora-black tracking-tight leading-tight">
              Stay Confirmed
            </h2>
            <p className="text-stayora-black/60 text-lg">
              Your stay at <span className="font-semibold text-stayora-black">{successListingTitle}</span> is booked.
            </p>
            <p className="text-xs text-stayora-black/30 font-bold uppercase tracking-widest pt-6">
              Preparing your timeline...
            </p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
