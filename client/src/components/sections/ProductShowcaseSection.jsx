import ProductGrid from '../ProductGrid';
import SectionHeader from '../ui/SectionHeader';

export default function ProductShowcaseSection({ products, title = 'Our Most Loved Pieces', eyebrow = 'Best Sellers' }) {
  if (!products?.length) return null;
  return (
    <section className="section-white py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          linkTo="/shop?sort=best_selling"
          linkLabel="View all products"
        />
        <ProductGrid products={products.slice(0, 4)} />
      </div>
    </section>
  );
}
