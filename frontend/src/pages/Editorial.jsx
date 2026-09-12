export const Editorial = () => {
  const articles = [
    {
      id: 1,
      title: "How to Choose the Perfect Stay for Your Next Trip",
      category: "Travel Guide",
      date: "August 2026",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
      excerpt: "Tips on evaluating locations, amenities, and reviews to find a villa or space that matches your budget and style."
    },
    {
      id: 2,
      title: "Essential Hosting Tips: Preparing Your Space for Guests",
      category: "Hosting",
      date: "July 2026",
      imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600&auto=format&fit=crop",
      excerpt: "Learn how to set up your home, coordinate smooth check-ins, and earn positive ratings from travelers."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 pt-28 md:pt-32 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] font-sans font-bold text-stayora-black/45 uppercase tracking-widest block">
          • Journal
        </span>
        <h1 className="font-serif text-5xl md:text-6xl text-stayora-black tracking-tight font-normal leading-none select-none">
          Stayora Journal
        </h1>
        <p className="text-stayora-black/60 text-sm md:text-base font-editorial leading-relaxed max-w-lg mx-auto pt-2">
          Travel guides, local stay stories, and practical hosting tips for our global community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-[#E5E5E5]/60">
        {articles.map(art => (
          <article key={art.id} className="space-y-4 group cursor-pointer">
            <div className="aspect-[16/10] overflow-hidden rounded-none bg-stayora-grey shadow-soft">
              <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="space-y-2 text-left">
              <div className="flex gap-3 text-[10px] font-bold text-stayora-red uppercase tracking-wider">
                <span>{art.category}</span>
                <span className="text-stayora-black/30">•</span>
                <span className="text-stayora-black/50 font-semibold lowercase tracking-normal">{art.date}</span>
              </div>
              <h2 className="font-editorial text-2xl font-medium text-stayora-black group-hover:text-stayora-red transition-colors">{art.title}</h2>
              <p className="text-stayora-black/75 text-sm leading-relaxed">{art.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
