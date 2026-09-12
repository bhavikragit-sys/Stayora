import React from 'react';

export const Input = React.forwardRef(({ label, id, className = '', placeholder, ...props }, ref) => {
  return (
    <div className="relative w-full text-left pt-5">
      <input
        ref={ref}
        id={id}
        placeholder={placeholder || " "}
        className={`peer w-full bg-transparent border-b border-[#E5E5E5] py-2 px-0 text-stayora-black focus:outline-none text-sm transition-all duration-300 placeholder-transparent ${className}`}
        {...props}
      />
      {label && (
        <label 
          htmlFor={id} 
          className="absolute left-0 top-5 text-[10px] font-sans font-bold text-stayora-black uppercase tracking-wider transition-all duration-300 origin-top-left -translate-y-4 pointer-events-none peer-placeholder-shown:translate-y-1.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-semibold peer-placeholder-shown:text-stayora-black/40 peer-focus:-translate-y-4 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-stayora-black"
        >
          {label}
        </label>
      )}
      <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-stayora-black transition-all duration-300 -translate-x-1/2 peer-focus:w-full" />
    </div>
  );
});

Input.displayName = 'Input';
