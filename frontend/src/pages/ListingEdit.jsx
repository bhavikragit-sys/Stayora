import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useListing } from '../hooks/useListings';
import { ListingForm } from '../components/listings/ListingForm';
import { Button } from '../components/ui/Button';
import { useQueryClient } from '@tanstack/react-query';

import { useToast } from '../context/ToastContext';

export const ListingEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  
  const { data: listing, isLoading: isFetching, error: fetchError } = useListing(id);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (data) => {
    setError('');
    setIsLoading(true);
    
    try {
      await axios.put(`/api/listings/${id}`, data);
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      addToast('Listing updated successfully', 'success');
      navigate(`/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing. Please try again.');
      addToast('Failed to update listing', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/listings/${id}`);
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      addToast('Listing deleted successfully', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete listing.');
      addToast('Failed to delete listing', 'error');
      setIsDeleting(false);
    }
  };

  if (isFetching) {
    return <div className="max-w-4xl mx-auto px-6 py-12 text-stayora-black/50">Loading listing details...</div>;
  }

  if (fetchError || !listing) {
    return <div className="max-w-4xl mx-auto px-6 py-12 text-stayora-red font-bold">Listing not found or you don't have permission to edit it.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 pt-28 md:pt-32">
      {error && (
        <div className="p-4 mb-6 bg-stayora-red/10 text-stayora-red rounded-none text-sm font-semibold text-left">
          {error}
        </div>
      )}

      <ListingForm 
        initialData={listing} 
        onSubmit={handleSubmit} 
        onDelete={handleDelete}
        isLoading={isLoading || isDeleting} 
        isEdit={true} 
      />
    </div>
  );
};
