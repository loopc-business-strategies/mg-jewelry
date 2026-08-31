import { Link } from 'react-router-dom';
import ProductGrid from '../ProductGrid';

export default function ProductShowcaseSection({ products, title = 'Featured Collections' }) {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="font-display text-3xl md:text-4xl text-charcoal">{title}</h2>
          <p className="text-muted mt-2">Premium jewelry crafted for international markets</p>
        </div>
        <Link to="/shop" className="text-gold-dark font-medium hover:underline shrink-0">View all collections →</Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
