// Price formatter — backend prices are already in INR.
// Just display with ₹ symbol and Indian number formatting.
export const formatPrice = (amount) => {
  if (amount == null || isNaN(Number(amount))) return '—';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};
