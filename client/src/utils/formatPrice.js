import { BASE_CURRENCY, exchangeRates } from './marketConfig';

export function convertPrice(price, targetCurrency) {
  if (!price && price !== 0) return 0;
  if (targetCurrency === BASE_CURRENCY) return price;
  const rate = exchangeRates[targetCurrency];
  if (rate) return price * rate;
  return price;
}

export const formatPrice = (price, options = {}) => {
  if (!price && price !== 0) return '';
  const currency = options.currency || BASE_CURRENCY;
  const locale = options.locale || 'en-IN';
  const converted = convertPrice(price, currency);

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'UZS' || currency === 'INR' ? 0 : 2,
  }).format(converted);
};

export const calcEmi = (price, months = 12) => Math.round(price / months);

export const calcDiscount = (mrp, price) => {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};
