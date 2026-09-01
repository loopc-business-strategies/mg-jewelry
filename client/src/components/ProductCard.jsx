import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductImage from './ProductImage';
import PriceDisplay from './PriceDisplay';
import WishlistButton from './WishlistButton';
import StarRating from './ui/StarRating';

function slugToLabel(slug) {
  if (!slug) return '';
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function ProductCardActions({ productId, onAddToCart }) {
  return (
    <div className="product-card-actions-inner overlay-cream px-3 py-2.5">
      <div className="product-card-actions">
        <Link to={`/product/${productId}`} className="btn-card-view">
          View Product
        </Link>
        <button type="button" onClick={onAddToCart} className="btn-card-cart">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const hasRating = product.rating > 0 && product.reviewCount > 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product._id);
  };

  return (
    <div className="product-card-grid group card-elegant h-full">
      <div className="product-card-image relative aspect-square bg-linen overflow-hidden image-zoom-hover">
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <ProductImage product={product} containerClassName="w-full h-full object-cover" />
        </Link>
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton productId={product._id} />
        </div>
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-white/95 text-ruby text-[10px] px-2 py-1 tracking-wide font-medium">
            {product.discount}% OFF
          </span>
        )}
      </div>

      <div className="product-card-info p-4 md:p-5 flex flex-col flex-1">
        {product.category && (
          <p className="text-[10px] tracking-[0.15em] uppercase text-emerald mb-1">{slugToLabel(product.category)}</p>
        )}
        <Link to={`/product/${product._id}`}>
          <h3 className="font-display text-lg text-charcoal mb-1 line-clamp-1 hover:text-gold-dark transition-colors">
            {product.name}
          </h3>
        </Link>
        <PriceDisplay price={product.price} mrp={product.mrp} size="sm" />
        {hasRating && (
          <div className="mt-2">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size={12} />
          </div>
        )}
      </div>

      <ProductCardActions
        productId={product._id}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
