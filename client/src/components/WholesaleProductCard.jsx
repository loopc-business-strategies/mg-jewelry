import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import ProductImage from './ProductImage';

export default function WholesaleProductCard({ product, showPrices, onAdd }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all">
      <Link to={`/product/${product._id}`}>
        <ProductImage product={product} />
      </Link>
      <div className="p-4">
        <h3 className="font-display text-lg line-clamp-1">{product.name}</h3>
        <p className="text-xs text-muted mb-2">SKU: {product.sku}</p>
        <div className="space-y-1 text-sm">
          <p>Retail: <span className="line-through text-muted">{formatPrice(product.price)}</span></p>
          {showPrices ? (
            <p className="font-semibold text-gold-dark">Wholesale: {formatPrice(product.wholesalePrice)}</p>
          ) : (
            <p className="text-muted italic">Login for wholesale pricing</p>
          )}
          <p className="text-xs">MOQ: {product.moq} pieces · Stock: {product.stock}</p>
        </div>
        {showPrices && onAdd && (
          <button
            onClick={() => onAdd(product._id, product.moq)}
            className="w-full mt-3 bg-gold text-white py-2 rounded-lg text-sm hover:bg-gold-dark transition-colors"
          >
            Add to Bulk Order
          </button>
        )}
      </div>
    </div>
  );
}
