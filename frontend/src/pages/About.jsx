import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 pt-28 md:pt-32 space-y-10">
      <div className="space-y-2 text-left">
        <span className="text-[10px] font-sans font-bold text-stayora-black/45 uppercase tracking-widest block">
          • About Stayora
        </span>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stayora-black leading-tight tracking-tight select-none">
          Our Mission
        </h1>
        <p className="text-stayora-black/60 text-lg md:text-xl font-editorial leading-relaxed pt-2">
          Connecting travelers with unique spaces, villas, and homes around the world at a reasonable cost.
        </p>
      </div>

      <div className="aspect-[2/1] overflow-hidden rounded-none bg-stayora-grey shadow-soft">
        <img 
          src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop" 
          alt="Architectural space" 
          className="w-full h-full object-cover"
        />
      </div>

      <section className="space-y-4 pt-6 border-t border-[#E5E5E5] text-left">
        <h2 className="font-editorial text-2xl lg:text-3xl font-medium text-stayora-black">Find Your Next Stay</h2>
        <p className="text-stayora-black/75 leading-relaxed text-sm md:text-base font-sans">
          We believe that finding a great place to stay should be simple and inspiring. From seaside villas to cozy apartments, we list unique spaces that fit your budget and travel style. Discover and book your next stay dynamically.
        </p>
      </section>

      <section className="space-y-4 pt-6 border-t border-[#E5E5E5] text-left">
        <h2 className="font-editorial text-2xl lg:text-3xl font-medium text-stayora-black">Host Your Space</h2>
        <p className="text-stayora-black/75 leading-relaxed text-sm md:text-base font-sans">
          Have an extra room, apartment, or holiday home? List it on Stayora to reach travelers looking for authentic experiences. We make it easy to manage bookings, connect with guests, and share your space.
        </p>
      </section>
    </div>
  );
};
