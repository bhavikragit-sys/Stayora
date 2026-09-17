import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api/axios';
import { useListings } from '../hooks/useListings';
import { ListingCard, ListingCardSkeleton } from '../components/listings/ListingCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

export const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { addToast } = useToast();
  
  // Edit form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch host user details to get stats like listing count and join date
  const { data: profileStats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['user-profile', user?._id],
    queryFn: async () => {
      const res = await api.get(`/api/users/${user._id}`);
      return res.data.user;
    },
    enabled: !!user?._id
  });

  // Fetch listings to filter client-side
  const { data: listingsData, isLoading: isListingsLoading } = useListings();

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    if (!name.trim()) {
      setError('Full name cannot be empty.');
      setIsSaving(false);
      return;
    }
    if (!email.trim()) {
      setError('Email address cannot be empty.');
      setIsSaving(false);
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      setIsSaving(false);
      return;
    }
    const payload = {};
    if (name !== user?.name) payload.name = name;
    if (email !== user?.email) payload.email = email;
    if (password) payload.password = password;

    if (Object.keys(payload).length === 0) {
      setError('No changes to update.');
      setIsSaving(false);
      return;
    }

    try {
      const res = await api.put('/api/users/me', payload);
      setUser({
        ...user,
        name: res.data.user.name,
        email: res.data.user.email
      });
      setSuccess('Profile updated successfully!');
      addToast('Profile updated successfully!', 'success');
      setPassword('');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
      addToast('Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return <div className="max-w-7xl mx-auto px-6 py-16 text-stayora-black/50">Please log in to view your profile.</div>;
  }

  const hostListings = listingsData?.items?.filter(
    listing => listing.owner === user._id || listing.owner?._id === user._id
  ) || [];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 pt-28 md:pt-32">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 flex flex-col items-center text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-stayora-black text-white flex items-center justify-center text-2xl font-bold tracking-wide select-none">
            {user.name
              ? user.name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('')
              : '?'}
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-stayora-black">{user.name}</h1>
            <p className="text-sm text-stayora-black/50">Your Profile</p>
          </div>

          <div className="w-full border-t border-[#E5E5E5]/50 pt-4 text-left space-y-3 text-sm">
            <div>
              <span className="block font-semibold text-stayora-black">Email</span>
              <span className="text-stayora-black/70">{user.email}</span>
            </div>
            {profileStats?.createdAt && (
              <div>
                <span className="block font-semibold text-stayora-black">Joined</span>
                <span className="text-stayora-black/70">
                  {new Date(profileStats.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            )}
          </div>

          <Button 
            variant="secondary" 
            onClick={() => {
              setIsEditing(!isEditing);
              setName(user.name);
              setEmail(user.email);
              setPassword('');
              setError('');
              setSuccess('');
            }}
            className="w-full text-sm py-2.5 rounded-none"
          >
            {isEditing ? 'View Stays & Portfolio' : 'Edit Profile Details'}
          </Button>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <div className="space-y-6">
              <div className="text-left space-y-1">
                <span className="text-[10px] font-sans font-bold text-stayora-black/45 uppercase tracking-widest block">
                  • Settings
                </span>
                <h2 className="font-serif text-3xl text-stayora-black leading-tight tracking-tight select-none">Edit Profile Details</h2>
                <p className="text-sm text-stayora-black/50">Change your account settings below.</p>
              </div>

              {error && (
                <div className="p-4 bg-stayora-red/10 text-stayora-red rounded-none text-sm font-semibold text-left">
                  {error}
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="space-y-6 py-4" noValidate>
                <Input 
                  id="name"
                  type="text" 
                  label="Full Name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
                <Input 
                  id="email"
                  type="email" 
                  label="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <Input 
                  id="password"
                  type="password" 
                  label="New Password (optional)" 
                  placeholder="Leave blank to keep current password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                
                <div className="flex justify-end gap-4 pt-4 border-t border-[#E5E5E5]/50">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => setIsEditing(false)}
                    className="px-6 rounded-none"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={isSaving} 
                    className="px-8 rounded-none"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-8 text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-bold text-stayora-black/45 uppercase tracking-widest block">
                  • Portfolio
                </span>
                <h2 className="font-serif text-3xl text-stayora-black leading-tight tracking-tight select-none">Your Hosted Listings ({hostListings.length})</h2>
              </div>
              
              {isListingsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[1, 2].map((n) => (
                    <ListingCardSkeleton key={n} />
                  ))}
                </div>
              ) : hostListings.length === 0 ? (
                <p className="text-stayora-black/50">You haven't listed any spaces yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {hostListings.map(listing => (
                    <ListingCard key={listing._id} listing={listing} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
