import { createContext, useContext, useState, useCallback } from 'react';

// ── Currencies (base = USD) ───────────────────────────────────────────────────
export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD $', rate: 1      },
  { code: 'INR', symbol: '₹', label: 'INR ₹', rate: 83.92 },
  { code: 'EUR', symbol: '€', label: 'EUR €', rate: 0.92  },
  { code: 'GBP', symbol: '£', label: 'GBP £', rate: 0.79  },
];

// ── localStorage helpers ──────────────────────────────────────────────────────
const readLS  = (key, fallback) => { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } };
const writeLS = (key, val)      => { try { localStorage.setItem(key, val); }             catch { /* ignore */      } };

// ── Context ───────────────────────────────────────────────────────────────────
const LocaleContext = createContext(null);

export const LocaleProvider = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState(() => readLS('stayora_currency', 'USD'));

  const currency = CURRENCIES.find(c => c.code === currencyCode) ?? CURRENCIES[0];

  const selectCurrency = useCallback((code) => {
    setCurrencyCode(code);
    writeLS('stayora_currency', code);
  }, []);

  /**
   * formatPrice(usdAmount)
   * Converts a backend USD price to the selected currency and returns a
   * formatted string like "₹2,09,800" or "$2,500".
   * Backend prices are never mutated — this is display-only.
   */
  const formatPrice = useCallback((usdAmount) => {
    if (usdAmount == null || isNaN(Number(usdAmount))) return '—';
    const converted = Math.round(Number(usdAmount) * currency.rate);
    return `${currency.symbol}${converted.toLocaleString()}`;
  }, [currency]);

  return (
    <LocaleContext.Provider value={{ currency, currencyCode, selectCurrency, formatPrice, CURRENCIES }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>');
  return ctx;
};
