import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import WishlistButton from './WishlistButton';

function slugToLabel(slug) {
  if (!slug) return '';
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function ProductCardActions({ productId }) {
  return (
    <div className="product-card-actions-inner overlay-cream px-2 py-2">
      <div className="product-card-actions">
        <Link to={`/product/${productId}`} className="btn-card-view">
          View Product
        </Link>
      </div>
    </div>
  );
}

export default function ProductCard({ product }) {
  return (
    <div className="product-card-grid group card-elegant h-full bg-white">
      <div className="product-card-image relative aspect-square bg-white overflow-hidden image-zoom-hover rounded-t-[0.625rem]">
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <ProductImage product={product} containerClassName="w-full h-full bg-white" />
        </Link>
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton productId={product._id} />
        </div>
      </div>

      <div className="product-card-info p-4 md:p-5 flex flex-col flex-1">
        {product.category && (
          <p className="type-micro mb-1.5">{slugToLabel(product.category)}</p>
        )}
        <Link to={`/product/${product._id}`}>
          <h3 className="type-card-title mb-1 line-clamp-1 hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>
      </div>

      <ProductCardActions productId={product._id} />
    </div>
  );
}
