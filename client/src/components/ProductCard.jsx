import { Link } from 'react-router-dom';
import { getProductImage } from '../utils/imageConfig';
import PriceDisplay from './PriceDisplay';
import WishlistButton from './WishlistButton';
import { useCart } from '../context/CartContext';
import { Eye, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);
  const img1 = getProductImage(product, 0);
  const img2 = getProductImage(product, 1);

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-cream">
          <img
            src={hovered && product.images?.[1] ? img2 : img1}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 right-3">
            <WishlistButton productId={product._id} />
          </div>
          {product.discount > 0 && (
            <span className="absolute top-3 left-3 bg-gold text-white text-xs px-2 py-1 rounded-full font-medium">
              {product.discount}% OFF
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
            <button
              onClick={(e) => { e.preventDefault(); onQuickView?.(product); }}
              className="flex-1 flex items-center justify-center gap-1 bg-white/95 text-charcoal text-xs py-2 rounded-lg hover:bg-gold hover:text-white transition-colors"
            >
              <Eye size={14} /> Quick View
            </button>
            <button
              onClick={(e) => { e.preventDefault(); addToCart(product._id); }}
              className="flex-1 flex items-center justify-center gap-1 bg-charcoal text-white text-xs py-2 rounded-lg hover:bg-gold transition-colors"
            >
              <ShoppingBag size={14} /> Add to Cart
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg text-charcoal mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-xs text-muted mb-2 line-clamp-1">{product.shortDescription}</p>
          <PriceDisplay price={product.price} mrp={product.mrp} showEmi />
          <p className="text-xs text-gold-dark mt-2 cursor-pointer hover:underline">Check Delivery Date</p>
        </div>
      </Link>
    </div>
  );
}
