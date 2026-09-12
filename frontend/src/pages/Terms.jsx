export const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 pt-28 md:pt-32 space-y-8 text-left">
      <div className="space-y-2">
        <span className="text-[10px] font-sans font-bold text-stayora-black/45 uppercase tracking-widest block">
          • Legal
        </span>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stayora-black leading-tight tracking-tight select-none">
          Terms of Service
        </h1>
        <p className="text-xs text-stayora-black/50 tracking-wider uppercase font-medium">
          Last updated: August 2026
        </p>
      </div>
      
      <p className="text-base text-stayora-black/80 leading-relaxed font-sans border-b border-[#E5E5E5]/60 pb-6">
        By accessing or using Stayora, you agree to comply with and be bound by these Terms of Service. Please review them carefully.
      </p>
      
      <section className="space-y-3 pt-4">
        <h2 className="font-editorial text-xl lg:text-2xl font-medium text-stayora-black">1. User Agreement</h2>
        <p className="text-stayora-black/75 leading-relaxed text-sm">
          By accessing or using the Stayora platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the website.
        </p>
      </section>

      <section className="space-y-3 pt-6 border-t border-[#E5E5E5]/60">
        <h2 className="font-editorial text-xl lg:text-2xl font-medium text-stayora-black">2. Hosting Responsibilities</h2>
        <p className="text-stayora-black/75 leading-relaxed text-sm">
          Hosts are responsible for providing accurate property listings, including descriptions, locations, capacity limits, and pricing per night.
        </p>
      </section>

      <section className="space-y-3 pt-6 border-t border-[#E5E5E5]/60">
        <h2 className="font-editorial text-xl lg:text-2xl font-medium text-stayora-black">3. Guest Stays</h2>
        <p className="text-stayora-black/75 leading-relaxed text-sm">
          Guests agree to respect the host's property policies, check-in/out times, and guest limit capacity. Cancelled bookings are soft-deleted to preserve stay history in our databases.
        </p>
      </section>
    </div>
  );
};
