import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api/axios';
import { useListings } from '../hooks/useListings';
import { ListingCard, ListingCardSkeleton } from '../components/listings/ListingCard';

export const PublicProfile = () => {
  const { id } = useParams();

  // Fetch host user details
  const { data: profileData, isLoading: isProfileLoading, error: profileError } = useQuery({
    queryKey: ['user-profile', id],
    queryFn: async () => {
      const res = await api.get(`/api/users/${id}`);
      return res.data.user;
    },
    enabled: !!id
  });

  // Fetch listings to filter on the client side (since backend doesn't support query by owner)
  const { data: listingsData, isLoading: isListingsLoading } = useListings();

  if (isProfileLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-28 md:pt-32 pb-24 text-left space-y-8 animate-pulse">
        <div className="h-10 bg-stayora-grey w-1/4 rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="h-64 bg-stayora-grey rounded"></div>
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 bg-stayora-grey w-1/3 rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="aspect-[4/3] bg-stayora-grey rounded"></div>
              <div className="aspect-[4/3] bg-stayora-grey rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (profileError || !profileData) {
    return <div className="max-w-7xl mx-auto px-6 pt-28 md:pt-32 pb-24 text-stayora-red font-bold text-lg text-left">User profile not found.</div>;
  }

  const hostListings = listingsData?.items?.filter(
    listing => listing.owner === id || listing.owner?._id === id
  ) || [];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-28 md:pt-32 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Profile Details Sidebar */}
        <div className="lg:col-span-1 flex flex-col items-center text-center space-y-4 py-4 border-b lg:border-b-0 lg:border-r border-[#E5E5E5] lg:pr-8">
          <div className="w-24 h-24 rounded-full bg-stayora-black text-white flex items-center justify-center text-2xl font-bold tracking-wide select-none">
            {profileData.name
              ? profileData.name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('')
              : '?'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stayora-black">{profileData.name}</h1>
            <p className="text-sm text-stayora-black/50 mt-1">Host</p>
          </div>
          
          <div className="w-full border-t border-[#E5E5E5] pt-4 text-left space-y-3 text-sm">
            {profileData.email && (
              <div>
                <span className="block font-semibold text-stayora-black">Email</span>
                <span className="text-stayora-black/70">{profileData.email}</span>
              </div>
            )}
            <div>
              <span className="block font-semibold text-stayora-black">Joined</span>
              <span className="text-stayora-black/70">
                {new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Listings Portfolio */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold text-stayora-black">Listings Hosted by {profileData.name} ({profileData.listingCount})</h2>
          
          {isListingsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2].map((n) => (
                <ListingCardSkeleton key={n} />
              ))}
            </div>
          ) : hostListings.length === 0 ? (
            <p className="text-stayora-black/50">This host has no listings published yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {hostListings.map(listing => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
