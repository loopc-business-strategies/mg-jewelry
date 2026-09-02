import { formatPrice as formatPriceBase } from '../utils/formatPrice';
import { useMarket } from '../context/MarketContext';

export function useFormatPrice() {
  const { prefs, locale } = useMarket();

  return (price) =>
    formatPriceBase(price, {
      currency: prefs.currency,
      locale: locale || 'en',
    });
}

export default function PriceDisplay({ price, mrp, size = 'md', showEmi = false }) {
  const formatPrice = useFormatPrice();
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' };

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`font-semibold text-gold ${sizes[size]}`}>{formatPrice(price)}</span>
        {mrp > price && (
          <>
            <span className="text-muted line-through text-sm">{formatPrice(mrp)}</span>
            {discount > 0 && (
              <span className="badge-subtle">
                {discount}% off
              </span>
            )}
          </>
        )}
      </div>
      {showEmi && price > 5000 && (
        <p className="text-xs text-muted mt-1">EMI from {formatPrice(Math.round(price / 12))}/mo</p>
      )}
    </div>
  );
}
