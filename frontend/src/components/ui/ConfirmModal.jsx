import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

/**
 * ConfirmModal — a Stayora-styled replacement for window.confirm().
 *
 * Props:
 *   isOpen        {boolean}  — controls visibility
 *   onConfirm     {fn}       — called when the user confirms
 *   onCancel      {fn}       — called when the user cancels or clicks the backdrop
 *   title         {string}   — modal heading
 *   message       {string}   — descriptive body text
 *   confirmLabel  {string}   — confirm button label (default: "Confirm")
 *   isDanger      {boolean}  — when true, confirm button uses stayora-red style
 *   isLoading     {boolean}  — disables buttons during async operation
 */
export const ConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Are you sure?',
  message = '',
  confirmLabel = 'Confirm',
  isDanger = false,
  isLoading = false,
}) => {
  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 top-0 left-0 w-screen h-screen bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fade-in overflow-y-auto"
      onClick={onCancel}
    >
      <div
        className="bg-white border border-[#E5E5E5] p-8 max-w-md w-full shadow-2xl space-y-6 text-left animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon + Title */}
        <div className="space-y-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
              isDanger
                ? 'bg-stayora-red/10 border border-stayora-red/20 text-stayora-red'
                : 'bg-stayora-grey border border-[#E5E5E5] text-stayora-black/60'
            }`}
          >
            {isDanger ? '!' : '?'}
          </div>
          <h3 className="font-serif text-2xl text-stayora-black font-bold tracking-tight">
            {title}
          </h3>
          {message && (
            <p className="text-sm text-stayora-black/70 leading-relaxed">{message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E5E5]">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 rounded-none"
          >
            Cancel
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-2.5 font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 ${
              isDanger
                ? 'bg-stayora-red hover:bg-red-700 text-white'
                : 'bg-stayora-black hover:bg-stayora-black/85 text-white'
            }`}
          >
            {isLoading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
