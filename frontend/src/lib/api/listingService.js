import api from "./axios";

export const normalizeListings = res => ({
  items: res.data.listings || [],
  pagination: res.data.pagination || {}
});

export const normalizeListing = res => res.data.listing ?? res.data;

export const listingService = {
  getListings: async (params = {}) => {
    const res = await api.get('/api/listings', { params });
    return normalizeListings(res);
  },

  getListing: async (id) => {
    const res = await api.get(`/api/listings/${id}`);
    return normalizeListing(res);
  },

  getListingReviews: async (id) => {
    const res = await api.get(`/api/listings/${id}/reviews`);
    return res.data;
  },

  getListingBookings: async (id) => {
    const res = await api.get(`/api/listings/${id}/bookings`);
    return res.data.bookings || [];
  },

  deleteReview: async (id) => {
    const res = await api.delete(`/api/reviews/${id}`);
    return res.data;
  }
};