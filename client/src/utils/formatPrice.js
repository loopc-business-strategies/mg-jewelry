/** Currency of stored product prices. */
export const BASE_CURRENCY = 'INR';

export const formatPrice = (price, options = {}) => {
  if (!price && price !== 0) return '';
  const locale = options.locale || 'en-IN';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: BASE_CURRENCY,
    maximumFractionDigits: 0,
  }).format(price);
};

export const calcEmi = (price, months = 12) => Math.round(price / months);

export const calcDiscount = (mrp, price) => {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};
