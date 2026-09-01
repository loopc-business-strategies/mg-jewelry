import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SafeImage from './SafeImage';
import { resolveProductImage } from '../utils/imageConfig';

export default function B2BProductCard({ product }) {
  const availabilityLabel = {
    in_stock: 'In Stock',
    made_to_order: 'Made to Order',
    out_of_stock: 'Out of Stock',
  }[product.availability] || 'Made to Order';

  return (
    <article className="group bg-white border border-gold/10 hover:border-gold/30 transition-colors overflow-hidden flex flex-col h-full">
      <Link to={`/product/${product._id}`} className="block">
        <div className="aspect-square overflow-hidden bg-ivory relative">
          <SafeImage
            src={resolveProductImage(product)}
            alt={product.name}
            category={product.category}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.purity && (
            <span className="absolute top-3 left-3 px-2 py-1 text-[10px] tracking-wider uppercase bg-dark/80 text-gold">
              {product.purity}
            </span>
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] tracking-wider uppercase text-muted mb-1">{product.sku}</p>
        <Link to={`/product/${product._id}`}>
          <h3 className="font-display font-semibold text-dark mb-2 group-hover:text-gold-dark transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="text-xs text-muted space-y-1 mb-4 flex-1">
          {product.weight && <p>Weight: {product.weight}</p>}
          {product.moq && <p>MOQ: {product.moq} units</p>}
          <p>{availabilityLabel}</p>
        </div>
        <p className="text-sm font-medium text-gold-dark mb-3">Price on Request</p>
        <Link
          to={`/product/${product._id}`}
          className="btn-gold-outline !py-2 !px-4 text-[10px] justify-center w-full"
        >
          Request Quote <ArrowRight size={12} />
        </Link>
      </div>
    </article>
  );
}
