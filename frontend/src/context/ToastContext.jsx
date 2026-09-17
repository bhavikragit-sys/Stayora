import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

// Per-type visual config: left border accent + icon
const TOAST_STYLES = {
  success: {
    border: 'border-l-emerald-400',
    icon: '✓',
    iconColor: 'text-emerald-400',
  },
  error: {
    border: 'border-l-stayora-red',
    icon: '✕',
    iconColor: 'text-stayora-red',
  },
  info: {
    border: 'border-l-blue-400',
    icon: 'ℹ',
    iconColor: 'text-blue-400',
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, isExiting: false }]);
    
    // Auto-remove after 4 seconds (start fading out at 3.7 seconds)
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => t.id === id ? { ...t, isExiting: true } : t));
    }, 3700);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, isExiting: true } : t));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container overlay */}
      <div className="fixed bottom-6 right-6 z-[100] space-y-3 pointer-events-none">
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type] || TOAST_STYLES.success;
          return (
            <div
              key={toast.id}
              onClick={() => removeToast(toast.id)}
              className={`pointer-events-auto flex items-center justify-between gap-6 bg-stayora-black text-white text-[11px] font-sans font-bold uppercase tracking-widest px-6 py-4 rounded-none shadow-[0_8px_32px_rgba(0,0,0,0.18)] border-y border-r border-white/10 border-l-[3px] cursor-pointer hover:bg-[#1C1C1C] transition-all duration-300 ${style.border} ${
                toast.isExiting 
                  ? 'opacity-0 -translate-y-2 pointer-events-none' 
                  : 'animate-toast-enter'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-[13px] shrink-0 ${style.iconColor}`}>{style.icon}</span>
                <span>{toast.message}</span>
              </div>
              <span className="text-white/40 text-[9px] pl-2 hover:text-white transition-colors shrink-0">✕</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
