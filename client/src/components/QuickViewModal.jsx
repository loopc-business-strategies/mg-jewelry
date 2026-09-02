import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag } from 'lucide-react';
import ProductImage from './ProductImage';
import PriceDisplay from './PriceDisplay';
import WishlistButton from './WishlistButton';
import { useCart } from '../context/CartContext';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 modal-backdrop" />
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream z-10" aria-label="Close">
          <X size={20} />
        </button>
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <ProductImage product={product} containerClassName="aspect-square overflow-hidden bg-cream rounded-xl" />
          <div className="flex flex-col">
            <h2 className="type-card-title mb-2">{product.name}</h2>
            <p className="text-sm text-muted mb-4 line-clamp-2">{product.shortDescription}</p>
            <PriceDisplay price={product.price} mrp={product.mrp} showEmi />
            <div className="flex gap-2 mt-4 text-sm text-muted">
              <span>{product.metal}</span>
              <span>·</span>
              <span>{product.purity}</span>
            </div>
            <div className="flex gap-3 mt-auto pt-6">
              <button
                onClick={() => { addToCart(product._id); onClose(); }}
                className="btn-card-cart py-2 px-4 text-[10px]"
              >
                <ShoppingBag size={12} /> Add to Cart
              </button>
              <WishlistButton productId={product._id} />
            </div>
            <Link to={`/product/${product._id}`} onClick={onClose} className="text-center text-sm text-gold-dark mt-4 hover:underline">
              View Full Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
