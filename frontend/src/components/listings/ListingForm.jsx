import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { ListingCard } from './ListingCard';

const listingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  pricePerNight: z.coerce.number().min(1, "Price must be greater than 0"),
  maxGuests: z.coerce.number().min(1, "Must allow at least 1 guest").max(50, "Max guests limit exceeded"),
  location: z.string().min(2, "Location is required"),
  country: z.string().min(2, "Country is required"),
  images: z.array(z.object({
    url: z.string().min(1, "Image URL/Data cannot be empty")
  })).min(1, "At least one image is required")
});

export const ListingForm = ({ initialData, onSubmit, onDelete, isLoading, isEdit }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Prevent browser default behavior of opening files when dropped anywhere on window
  useEffect(() => {
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener('dragover', preventDefaults);
    window.addEventListener('drop', preventDefaults);
    return () => {
      window.removeEventListener('dragover', preventDefaults);
      window.removeEventListener('drop', preventDefaults);
    };
  }, []);

  // Lock body scroll when Delete modal is open
  useEffect(() => {
    if (showDeleteModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showDeleteModal]);
  
  const { register, control, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      pricePerNight: '',
      maxGuests: 2,
      location: '',
      country: '',
      images: [{ url: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images"
  });

  // Watch form fields for live preview syncing
  const watchTitle = watch('title');
  const watchLocation = watch('location');
  const watchCountry = watch('country');
  const watchPrice = watch('pricePerNight');
  const watchImages = watch('images');

  const [selectedFiles, setSelectedFiles] = useState([]);

  // Trigger file dialog
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Helper to process and append incoming image files (from input or drag-and-drop)
  const processFiles = (files) => {
    const imageFiles = files.filter(file => file.type && file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    const newFiles = [];
    imageFiles.forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      file._previewUrl = previewUrl;
      newFiles.push(file);
      if (fields.length === 1 && !watchImages[0]?.url) {
        setValue('images.0.url', previewUrl, { shouldValidate: true });
      } else {
        append({ url: previewUrl });
      }
    });
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    trigger('images');
  };

  // Handle local image file selection from file picker
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
    e.target.value = '';
  };

  // Drag and drop event handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer?.files || []);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleRemoveImage = (index) => {
    const urlToRemove = watchImages[index]?.url;
    if (urlToRemove && urlToRemove.startsWith('blob:')) {
      setSelectedFiles(prev => prev.filter(file => file._previewUrl !== urlToRemove));
      URL.revokeObjectURL(urlToRemove);
    }
    remove(index);
  };

  const handleCustomSubmit = (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('pricePerNight', data.pricePerNight);
    formData.append('maxGuests', data.maxGuests);
    formData.append('location', data.location);
    formData.append('country', data.country);

    // Filter out blob preview URLs and keep valid web URLs / existing Cloudinary URLs
    const existingUrls = (data.images || [])
      .map(img => img.url)
      .filter(url => url && !url.startsWith('blob:'));

    formData.append('images', JSON.stringify(existingUrls));

    // Get current blob URLs in the form
    const currentBlobUrls = new Set(
      (data.images || [])
        .map(img => img.url)
        .filter(url => url && url.startsWith('blob:'))
    );

    // Append binary file objects to imageFiles field for Multer
    selectedFiles
      .filter(file => !file._previewUrl || currentBlobUrls.has(file._previewUrl))
      .forEach((file) => {
        formData.append('imageFiles', file);
      });

    onSubmit(formData);
  };

  // Step validation before advancing
  const handleNextStep = async (e) => {
    e.preventDefault();
    let fieldsToValidate = [];
    if (step === 1) {
      fieldsToValidate = ['title', 'location', 'country', 'description'];
    } else if (step === 2) {
      fieldsToValidate = ['pricePerNight', 'maxGuests'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = (e) => {
    e.preventDefault();
    setStep(prev => prev - 1);
  };

  // Construct mock listing object for live preview card
  const previewListing = {
    _id: initialData?._id || 'preview',
    title: watchTitle || 'Glass House Retreat',
    location: `${watchLocation || 'Hudson Valley'}${watchCountry ? `, ${watchCountry}` : ', NY'}`,
    pricePerNight: Number(watchPrice) || 650,
    images: watchImages && watchImages[0]?.url ? watchImages : [{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop' }],
    reviewCount: initialData?.reviewCount || 1,
    averageRating: initialData?.averageRating || 4.9
  };

  const stepTitles = {
    1: '1. Basics',
    2: '2. Pricing & Capacity',
    3: '3. Gallery & Finish'
  };

  return (
    <form onSubmit={handleSubmit(handleCustomSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
        
        {/* Left Form Inputs Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Header Title */}
          <div className="mb-6 space-y-2">
            <span className="text-[10px] font-sans font-bold text-stayora-black/45 uppercase tracking-widest block">
              • Listing Management
            </span>
            <h1 className="font-serif text-4xl lg:text-5xl text-stayora-black leading-tight tracking-tight select-none">
              {isEdit ? 'Edit Listing' : 'Create Listing'}
            </h1>
            <p className="text-sm text-stayora-black/50">
              {isEdit ? 'Update the details and imagery for your property.' : 'Add a new curated space to your portfolio.'}
            </p>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="space-y-2.5 pt-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-stayora-black/40 uppercase tracking-widest">
              <span>{stepTitles[step]}</span>
              <span>Step {step} of 3</span>
            </div>
            <div className="w-full bg-[#E5E5E5]/50 h-[1.5px] relative overflow-hidden rounded-none">
              <div 
                className="h-full bg-stayora-black transition-all duration-500 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <Input 
                id="title"
                label="Title" 
                placeholder="e.g. Glass House Retreat" 
                {...register('title')}
              />
              {errors.title && <p className="text-stayora-red text-xs font-semibold">{errors.title.message}</p>}

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  id="location"
                  label="Location" 
                  placeholder="e.g. Hudson Valley, NY" 
                  {...register('location')}
                />
                <Input 
                  id="country"
                  label="Country" 
                  placeholder="e.g. United States" 
                  {...register('country')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {errors.location && <p className="text-stayora-red text-xs font-semibold">{errors.location.message}</p>}
                {errors.country && <p className="text-stayora-red text-xs font-semibold">{errors.country.message}</p>}
              </div>

              <Textarea 
                id="description"
                label="Description"
                rows={6}
                placeholder="Describe the spatial qualities, environment and design details..."
                {...register('description')}
              />
              {errors.description && <p className="text-stayora-red text-xs font-semibold">{errors.description.message}</p>}
            </div>
          )}

          {/* STEP 2: PRICING & CAPACITY */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  id="pricePerNight"
                  label="Price Per Night ($)" 
                  placeholder="0" 
                  {...register('pricePerNight')}
                />
                <Input 
                  id="maxGuests"
                  label="Maximum Guests" 
                  placeholder="2" 
                  {...register('maxGuests')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {errors.pricePerNight && <p className="text-stayora-red text-xs font-semibold">{errors.pricePerNight.message}</p>}
                {errors.maxGuests && <p className="text-stayora-red text-xs font-semibold">{errors.maxGuests.message}</p>}
              </div>
            </div>
          )}

          {/* STEP 3: GALLERY & FINISH */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-xs font-bold text-stayora-black uppercase tracking-wider">Property Gallery</span>
                    <p className="text-xs text-stayora-black/50 mt-0.5">Upload high-resolution photos of your property space.</p>
                  </div>
                  {fields.length > 0 && fields[0]?.url && (
                    <span className="text-[10px] font-bold text-stayora-black/40 uppercase tracking-widest">
                      {fields.length} {fields.length === 1 ? 'photo' : 'photos'} added
                    </span>
                  )}
                </div>

                {/* File Upload Zone */}
                <div 
                  onClick={handleUploadClick}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-none py-10 px-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 select-none ${
                    isDragging 
                      ? 'border-stayora-black bg-stayora-grey/80 scale-[1.01]' 
                      : 'border-[#E5E5E5] hover:border-stayora-black bg-stayora-grey/30 hover:bg-stayora-grey/60 text-stayora-black/60 hover:text-stayora-black'
                  } group`}
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform pointer-events-none">
                    ↑
                  </div>
                  <div className="text-center pointer-events-none">
                    <span className="text-xs font-bold uppercase tracking-wider block">
                      {isDragging ? 'Drop images here' : 'Click to upload or drag and drop'}
                    </span>
                    <span className="text-[11px] text-stayora-black/40 mt-1 block">
                      JPG, PNG, WEBP or AVIF (Max 10MB per photo)
                    </span>
                  </div>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>

                {errors.images?.message && <p className="text-stayora-red text-xs font-semibold">{errors.images.message}</p>}

                {/* Thumbnail grid with interactive controls */}
                <div className="pt-2">
                  {fields.length > 0 && fields.some(f => watch(`images.${fields.indexOf(f)}.url`)) ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {fields.map((field, index) => {
                        const url = watch(`images.${index}.url`);
                        if (!url) return null;
                        return (
                          <div key={field.id} className="relative aspect-[4/3] bg-stayora-grey rounded-none overflow-hidden border border-[#E5E5E5] group">
                            <img src={url} alt={`Property image ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            
                            {/* Primary Cover Badge */}
                            {index === 0 && (
                              <span className="absolute top-2 left-2 bg-stayora-black/80 backdrop-blur-md text-white text-[9px] font-bold uppercase px-2 py-0.5 tracking-wider">
                                Cover Photo
                              </span>
                            )}

                            {/* Overlay Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 bg-stayora-black/70 hover:bg-stayora-red text-white w-7 h-7 flex items-center justify-center rounded-full opacity-90 transition-colors shadow-md text-xs font-bold"
                              title="Remove photo"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-stayora-grey/20 border border-dashed border-[#E5E5E5]">
                      <p className="text-xs text-stayora-black/40 font-medium">No property photos uploaded yet.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-[#E5E5E5] mt-8 w-full">
            <div className="flex gap-3 items-center">
              {step > 1 && (
                <Button type="button" variant="secondary" onClick={handlePrevStep} className="px-6 rounded-none">
                  Back
                </Button>
              )}
              {isEdit && (
                <button 
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="text-stayora-red hover:bg-stayora-red/10 border border-stayora-red/40 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Delete Listing
                </button>
              )}
            </div>
            
            {/* Right control (Next or Submit) */}
            <div className="flex gap-4">
              {step < 3 ? (
                <Button type="button" variant="primary" onClick={handleNextStep} className="px-8 rounded-none">
                  Next Step
                </Button>
              ) : (
                <>
                  <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')} disabled={isLoading} className="px-6 rounded-none">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={isLoading} className="px-8 rounded-none">
                    {isLoading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Publish Listing')}
                  </Button>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Right Live Preview Column */}
        <div className="lg:col-span-5 sticky top-28 space-y-4 hidden lg:block">
          <span className="block text-[10px] font-bold text-stayora-black/45 uppercase tracking-widest">
            Live Preview
          </span>
          <div className="w-full max-w-[340px] pointer-events-none opacity-90">
            <ListingCard listing={previewListing} />
          </div>
        </div>

      </div>

      {/* Delete Listing Confirmation Modal */}
      {showDeleteModal && createPortal(
        <div className="fixed inset-0 top-0 left-0 w-screen h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fade-in overflow-y-auto">
          <div className="bg-white border border-[#E5E5E5] p-8 max-w-md w-full shadow-2xl space-y-6 text-left">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-stayora-red/10 border border-stayora-red/20 flex items-center justify-center text-stayora-red font-bold text-xl">
                ⚠️
              </div>
              <h3 className="font-serif text-2xl text-stayora-black font-bold tracking-tight">Delete Listing Permanently?</h3>
              <p className="text-sm text-stayora-black/70 leading-relaxed">
                Are you sure you want to delete <strong className="text-stayora-black">"{watchTitle || 'this listing'}"</strong>?
              </p>
              <p className="text-xs text-stayora-black/50 leading-normal bg-stayora-grey/50 p-3 border-l-2 border-stayora-red">
                This action will permanently erase the property details, customer reviews, and all images hosted on Cloudinary. This cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E5E5]">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowDeleteModal(false)}
                disabled={isLoading}
                className="px-5 rounded-none"
              >
                Cancel
              </Button>
              <button 
                type="button" 
                onClick={() => {
                  onDelete();
                }}
                disabled={isLoading}
                className="px-6 py-2.5 bg-stayora-red hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </form>
  );
};
