import { formatPrice, calcEmi, calcDiscount } from '../utils/formatPrice';

export default function PriceDisplay({ price, mrp, size = 'md', showEmi = false }) {
  const discount = calcDiscount(mrp, price);
  const sizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`font-semibold text-charcoal ${sizes[size]}`}>{formatPrice(price)}</span>
        {mrp > price && (
          <>
            <span className="text-muted line-through text-sm">{formatPrice(mrp)}</span>
            {discount > 0 && (
              <span className="text-xs bg-gold/10 text-gold-dark px-2 py-0.5 rounded-full font-medium">
                {discount}% OFF
              </span>
            )}
          </>
        )}
      </div>
      {showEmi && price > 5000 && (
        <p className="text-xs text-muted mt-1">EMI from {formatPrice(calcEmi(price))}/mo</p>
      )}
    </div>
  );
}
