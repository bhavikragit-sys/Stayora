export const SplitAuthLayout = ({ children, imageSrc, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Editorial Portfolio Frame */}
      <div className="max-w-5xl w-full min-h-[600px] grid grid-cols-1 lg:grid-cols-12 bg-white border border-[#E5E5E5]/50 shadow-[0_32px_96px_rgba(0,0,0,0.04)] rounded-none overflow-hidden">
        
        {/* Left column: Full-bleed Visual Panel (7 cols on large screens) */}
        <div className="hidden lg:block lg:col-span-6 relative bg-stayora-grey overflow-hidden group">
          <img 
            src={imageSrc} 
            alt="Auth background" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] ease-out group-hover:scale-105 select-none"
          />
          {/* Dark soft gradient vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          
          {/* Overlay Text Block */}
          <div className="absolute bottom-10 left-10 right-10 text-left text-white space-y-2">
            <span className="text-[9px] font-sans font-bold text-white/70 uppercase tracking-widest block">
              • STAYORA HOMESTAYS
            </span>
            <p className="font-serif text-2xl text-white tracking-tight leading-tight select-none">
              Discover unique stays, beachfront villas, and rooms in destinations around the globe.
            </p>
          </div>
        </div>

        {/* Right column: Form Content (5 cols on large screens) */}
        <div className="lg:col-span-6 flex flex-col justify-center p-8 sm:p-12 lg:p-16 text-left">
          <div className="w-full max-w-sm mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-sans font-bold text-stayora-black/45 uppercase tracking-widest block">
                • Access Portal
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-stayora-black leading-tight tracking-tight select-none">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-stayora-black/50 leading-relaxed pt-0.5">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Form Content */}
            <div className="space-y-6 pt-2">
              {children}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
