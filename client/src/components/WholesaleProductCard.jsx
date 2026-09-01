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
        <h3 className="type-card-title line-clamp-1 mb-1">{product.name}</h3>
        <p className="type-micro text-muted normal-case mb-2">SKU: {product.sku}</p>
        <div className="space-y-1 type-body-sm">
          <p>Retail: <span className="line-through">{formatPrice(product.price)}</span></p>
          {showPrices ? (
            <p className="font-semibold text-gold">Wholesale: {formatPrice(product.wholesalePrice)}</p>
          ) : (
            <p className="italic">Login for wholesale pricing</p>
          )}
          <p className="type-form-help">MOQ: {product.moq} pieces · Stock: {product.stock}</p>
        </div>
        {showPrices && onAdd && (
          <button
            onClick={() => onAdd(product._id, product.moq)}
            className="w-full mt-3 btn-primary-gold justify-center text-xs py-2.5"
          >
            Add to Bulk Order
          </button>
        )}
      </div>
    </div>
  );
}
