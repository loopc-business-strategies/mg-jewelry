import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import PriceDisplay from './PriceDisplay';
import WishlistButton from './WishlistButton';
import StarRating from './ui/StarRating';

export default function ProductCard({ product, onQuickView }) {
  return (
    <div className="group card-elegant image-zoom-hover">
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative aspect-square bg-linen overflow-hidden">
          <ProductImage product={product} containerClassName="w-full h-full object-cover" />
          <div className="absolute top-3 right-3">
            <WishlistButton productId={product._id} />
          </div>
          {product.discount > 0 && (
            <span className="absolute top-3 left-3 bg-white/90 text-charcoal text-[10px] px-2 py-1 tracking-wide">
              {product.discount}% OFF
            </span>
          )}
        </div>
        <div className="p-4 md:p-5">
          <h3 className="font-display text-lg text-charcoal mb-1 line-clamp-1">{product.name}</h3>
          <PriceDisplay price={product.price} mrp={product.mrp} size="sm" />
          <div className="mt-2">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size={12} />
          </div>
        </div>
      </Link>
    </div>
  );
}
