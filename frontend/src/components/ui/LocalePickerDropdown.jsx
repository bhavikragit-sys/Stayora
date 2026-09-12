import { useRef, useState, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';

export const LocalePickerDropdown = () => {
  const [open, setOpen] = useState(false);
  const panelRef  = useRef(null);
  const triggerRef = useRef(null);

  const { currency, currencyCode, selectCurrency, CURRENCIES } = useLocale();

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e) => {
      if (
        panelRef.current  && !panelRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open]);

  // ── Close on Escape ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <div className="relative">
      {/* ── Trigger ── */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Currency: ${currency.label}. Click to change.`}
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-1.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stayora-black px-1 py-1
          ${open ? 'text-stayora-black' : 'text-stayora-black/60 hover:text-stayora-black'}`}
      >
        <Globe className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline">{currency.symbol} {currency.code}</span>
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div
          ref={panelRef}
          role="listbox"
          aria-label="Select currency"
          className="absolute right-0 top-full mt-3 w-[220px] bg-white border border-[#E5E5E5] rounded-card shadow-[0_8px_32px_rgba(0,0,0,0.10)] z-[60] animate-fade-in-up overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-[10px] font-bold text-stayora-black/45 uppercase tracking-widest">
              Currency
            </h3>
          </div>

          {/* Currency options */}
          <ul className="pb-2">
            {CURRENCIES.map((cur) => {
              const isActive = cur.code === currencyCode;
              return (
                <li key={cur.code} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => { selectCurrency(cur.code); setOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors text-left
                      ${isActive
                        ? 'bg-stayora-grey text-stayora-black'
                        : 'text-stayora-black/60 hover:bg-stayora-grey/50 hover:text-stayora-black'
                      }`}
                  >
                    <span>{cur.label}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-stayora-black shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>

        </div>
      )}
    </div>
  );
};
