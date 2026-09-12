import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { useListings } from '../hooks/useListings';
import { ListingCard } from '../components/listings/ListingCard';
import axios from 'axios';
import { useQueryClient, useQuery } from '@tanstack/react-query';

export const Dashboard = () => {
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();
  
  // Use a different query for "my listings" to avoid caching issues with the global listings
  const { data, isLoading } = useQuery({
    queryKey: ['my-listings'],
    queryFn: async () => {
      const res = await axios.get('/api/listings/me');
      return { items: res.data.listings || [] };
    }
  });

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      queryClient.clear();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 pt-28 md:pt-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-[#E5E5E5]/50 pb-8">
        <div className="space-y-1 text-left">
          <span className="text-[10px] font-sans font-bold text-stayora-black/45 uppercase tracking-widest block">
            • Host Control
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stayora-black leading-tight tracking-tight select-none">Welcome, {user?.name || 'User'}</h1>
          <p className="text-stayora-black/60 text-lg">Manage your profile and curated spaces.</p>
        </div>
        <div className="flex gap-4 mt-6 md:mt-0">
          <Link to="/profile">
            <Button variant="secondary">Profile</Button>
          </Link>
          <Button variant="secondary" onClick={handleLogout}>Log out</Button>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-serif text-3xl text-stayora-black">Your Listings</h2>
          <Link to="/dashboard/listings/new">
            <Button variant="primary">Create Listing</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {[1, 2, 3, 4].map((n) => (
                <div key={n} className="shimmer-bg rounded-none aspect-[4/3]"></div>
              ))}
          </div>
        ) : data?.items?.length === 0 ? (
          <div className="bg-stayora-grey/50 py-16 px-6 rounded-none text-center border border-[#E5E5E5]/50">
            <p className="text-lg text-stayora-black/70 mb-6 font-serif">You don't have any active listings yet.</p>
            <Link to="/dashboard/listings/new">
              <Button variant="primary" className="mx-auto">Create your first listing</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data?.items?.map(listing => (
              <div key={listing._id} className="relative group">
                <ListingCard listing={listing} />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/dashboard/listings/${listing._id}/edit`}>
                     <div className="bg-stayora-black text-white hover:bg-white hover:text-stayora-black border border-stayora-black transition-all duration-300 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-none shadow-md cursor-pointer select-none">
                       Edit
                     </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
