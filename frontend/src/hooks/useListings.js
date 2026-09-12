import { useQuery } from '@tanstack/react-query';
import { listingService } from '../lib/api/listingService';

export const useListings = (params = {}) => {
  return useQuery({
    queryKey: ['listings', params],
    queryFn: () => listingService.getListings(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useListing = (id) => {
  return useQuery({
    queryKey: ['listings', id],
    queryFn: () => listingService.getListing(id),
    enabled: !!id,
  });
};

export const useListingReviews = (id) => {
  return useQuery({
    queryKey: ['listing-reviews', id],
    queryFn: () => listingService.getListingReviews(id),
    enabled: !!id,
  });
};

export const useListingBookings = (id) => {
  return useQuery({
    queryKey: ['listing-bookings', id],
    queryFn: () => listingService.getListingBookings(id),
    enabled: !!id,
  });
};
