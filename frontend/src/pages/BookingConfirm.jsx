import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useListing } from '../hooks/useListings';
import { Button } from '../components/ui/Button';
import { useState } from 'react';
import api from '../lib/api/axios';
import { useQueryClient } from '@tanstack/react-query';
import { formatPrice } from '../lib/formatPrice';
import { useToast } from '../context/ToastContext';

export const BookingConfirm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const { data: listing, isLoading, error: fetchError } = useListing(id);

  // Extract check-in, check-out, and guests from state
  const { checkIn, checkOut, guests } = location.state || {};

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If details are missing, redirect back to listing detail
  if (!checkIn || !checkOut || !guests) {
     return (
       <div className="max-w-xl mx-auto px-6 py-16 text-center">
         <p className="text-lg text-stayora-black/70 mb-6">Booking details are missing. Please select dates first.</p>
         <Button variant="primary" onClick={() => navigate(`/listings/${id}`)}>Go to Listing</Button>
       </div>
     );
  }

  if (isLoading) {
    return <div className="max-w-xl mx-auto px-6 py-16 text-stayora-black/50">Loading confirmation details...</div>;
  }

  if (fetchError || !listing) {
    return <div className="max-w-xl mx-auto px-6 py-16 text-stayora-red font-bold">Listing not found.</div>;
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.max(1, Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)));
  const total = listing.pricePerNight * nights;

  const handleConfirm = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await api.post(`/api/listings/${id}/bookings`, {
        checkIn,
        checkOut,
        guests: Number(guests)
      });
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      addToast('Booking confirmed successfully!', 'success');
      navigate('/bookings', { state: { bookingSuccess: true, listingTitle: listing.title } });
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Booking failed. The listing might already be booked for these dates.';
      setError(errMsg);
      addToast('Booking failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const imageUrl = listing.images?.[0]?.url || 'https://via.placeholder.com/600&auto=format&fit=crop';

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 pt-28 md:pt-32 text-left">
      <div className="mb-10 space-y-2">
        <span className="text-[10px] font-sans font-bold text-stayora-black/45 uppercase tracking-widest block">
          • Reservation
        </span>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stayora-black leading-tight tracking-tight select-none">
          Confirm Booking
        </h1>
      </div>
      
      {error && (
        <div className="p-4 mb-6 bg-stayora-red/10 text-stayora-red rounded-none text-sm font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Details Section */}
        <div className="space-y-6 py-4">
          <h2 className="text-xl font-bold text-stayora-black border-b border-[#E5E5E5] pb-4">Your trip</h2>
          
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-stayora-black uppercase tracking-wider">Dates</div>
              <div className="text-stayora-black/70 mt-1">{checkIn} to {checkOut} ({nights} {nights === 1 ? 'night' : 'nights'})</div>
            </div>
            
            <div>
              <div className="text-xs font-bold text-stayora-black uppercase tracking-wider">Guests</div>
              <div className="text-stayora-black/70 mt-1">{guests} {guests === 1 ? 'guest' : 'guests'}</div>
            </div>
          </div>

          <div className="border-t border-[#E5E5E5] pt-6 space-y-4">
            <h3 className="text-lg font-bold text-stayora-black">Price Details</h3>
            <div className="flex justify-between text-stayora-black/70">
              <span>{formatPrice(listing.pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-stayora-black font-bold text-lg border-t border-[#E5E5E5] pt-4">
              <span>Total (INR)</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Button 
            variant="primary" 
            className="w-full text-lg py-4 mt-6" 
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Confirming...' : 'Book Listing'}
          </Button>
        </div>

        {/* Listing Card */}
        <div className="flex gap-4 p-4 border border-[#E5E5E5] rounded-none bg-stayora-grey/30">
          <div className="w-24 h-24 rounded-none overflow-hidden bg-stayora-grey flex-shrink-0">
            <img src={imageUrl} alt={listing.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-semibold text-stayora-black text-lg line-clamp-1">{listing.title}</h3>
            <p className="text-sm text-stayora-black/70 mt-1">{listing.location}, {listing.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
