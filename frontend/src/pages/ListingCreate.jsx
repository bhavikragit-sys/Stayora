import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api/axios';
import { ListingForm } from '../components/listings/ListingForm';

import { useToast } from '../context/ToastContext';

export const ListingCreate = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (data) => {
    setError('');
    setIsLoading(true);
    
    try {
      const response = await api.post('/api/listings', data);
      const newListing = response.data.listing;
      addToast('Listing created successfully', 'success');
      navigate(`/listings/${newListing._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing. Please try again.');
      addToast('Failed to create listing', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 pt-28 md:pt-32">
      {error && (
        <div className="p-4 mb-6 bg-stayora-red/10 text-stayora-red rounded-none text-sm font-semibold text-left">
          {error}
        </div>
      )}

      <ListingForm onSubmit={handleSubmit} isLoading={isLoading} isEdit={false} />
    </div>
  );
};
