export const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 pt-28 md:pt-32 space-y-8 text-left">
      <div className="space-y-2">
        <span className="text-[10px] font-sans font-bold text-stayora-black/45 uppercase tracking-widest block">
          • Legal
        </span>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stayora-black leading-tight tracking-tight select-none">
          Privacy Policy
        </h1>
        <p className="text-xs text-stayora-black/50 tracking-wider uppercase font-medium">
          Last updated: August 2026
        </p>
      </div>
      
      <p className="text-base text-stayora-black/80 leading-relaxed font-sans border-b border-[#E5E5E5]/60 pb-6">
        Stayora takes your privacy seriously. This document describes the personal data we collect, why we collect it, and how we handle it.
      </p>
      
      <section className="space-y-3 pt-4">
        <h2 className="font-editorial text-xl lg:text-2xl font-medium text-stayora-black">1. Information We Collect</h2>
        <p className="text-stayora-black/75 leading-relaxed text-sm">
          We collect information you provide directly to us when creating an account, publishing a listing, or booking a stay. This includes your name, email address, profile listings, and check-in details.
        </p>
      </section>

      <section className="space-y-3 pt-6 border-t border-[#E5E5E5]/60">
        <h2 className="font-editorial text-xl lg:text-2xl font-medium text-stayora-black">2. How We Use Data</h2>
        <p className="text-stayora-black/75 leading-relaxed text-sm">
          We use the information we collect to operate and maintain the Stayora platform, handle booking reserves, enable messaging between hosts and guests, and update ratings statistics dynamically.
        </p>
      </section>

      <section className="space-y-3 pt-6 border-t border-[#E5E5E5]/60">
        <h2 className="font-editorial text-xl lg:text-2xl font-medium text-stayora-black">3. Sharing</h2>
        <p className="text-stayora-black/75 leading-relaxed text-sm">
          We do not sell or lease your personal details to third parties. Host contact details are only shared with guests who hold confirmed reservations.
        </p>
      </section>
    </div>
  );
};
