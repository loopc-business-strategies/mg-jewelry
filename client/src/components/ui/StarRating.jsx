import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, reviewCount, size = 14, showCount = true }) {
  if (!rating && !reviewCount) return null;
  const rounded = Math.round(rating || 0);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= rounded ? 'fill-gold text-gold' : 'text-gray-200'}
          />
        ))}
      </div>
      {showCount && reviewCount != null && reviewCount > 0 && (
        <span className="text-xs text-muted">({reviewCount})</span>
      )}
    </div>
  );
}
