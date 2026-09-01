import ProductCard from './ProductCard';
import B2BProductCard from './B2BProductCard';

export default function ProductGrid({ products, onQuickView, variant = 'b2b' }) {
  if (!products?.length) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        variant === 'b2b' ? (
          <B2BProductCard key={product._id} product={product} />
        ) : (
          <ProductCard key={product._id} product={product} onQuickView={onQuickView} />
        )
      ))}
    </div>
  );
}
