import { formatPrice as formatPriceBase } from '../utils/formatPrice';
import { useMarket } from '../context/MarketContext';
import { useTranslation } from '../hooks/useTranslation';

export function useFormatPrice() {
  const { locale } = useMarket();

  return (price) => formatPriceBase(price, { locale: locale || 'en' });
}

export default function PriceDisplay({ price, mrp, size = 'md', showEmi = false }) {
  const formatPrice = useFormatPrice();
  const { tf } = useTranslation();
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
                {tf('ui.percentOff', { n: discount })}
              </span>
            )}
          </>
        )}
      </div>
      {showEmi && price > 5000 && (
        <p className="text-xs text-muted mt-1">{tf('ui.emiFrom', { amount: formatPrice(Math.round(price / 12)) })}</p>
      )}
    </div>
  );
}
