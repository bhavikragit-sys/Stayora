export const Button = ({ variant = 'primary', className = '', children, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-sans text-xs font-bold uppercase tracking-[0.2em] hover:tracking-[0.26em] hover:-translate-y-[1px] active:translate-y-0 rounded-none transition-all duration-300 ease-out min-h-[48px] px-8 cursor-pointer select-none";
  
  const variants = {
    primary: "bg-stayora-black text-white border border-stayora-black hover:bg-transparent hover:text-stayora-black",
    secondary: "bg-transparent border border-stayora-black/25 text-stayora-black hover:border-stayora-black hover:bg-stayora-grey/30"
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
