import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistButton({ productId, className = '' }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const active = isInWishlist(productId);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    active ? removeFromWishlist(productId) : addToWishlist(productId);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all ${className}`}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart size={18} className={active ? 'fill-red-500 text-red-500' : 'text-charcoal'} />
    </button>
  );
}
