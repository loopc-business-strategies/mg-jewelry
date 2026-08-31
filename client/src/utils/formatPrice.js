export const formatPrice = (price) => {
  if (!price && price !== 0) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const calcEmi = (price, months = 12) => Math.round(price / months);

export const calcDiscount = (mrp, price) => {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};
