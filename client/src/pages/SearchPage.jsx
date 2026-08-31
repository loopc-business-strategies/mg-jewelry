import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import ProductGrid from '../components/ProductGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) { setProducts([]); setLoading(false); return; }
    setLoading(true);
    api.get(`/search?q=${encodeURIComponent(q)}&limit=24`)
      .then(({ data }) => setProducts(data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <>
      <SEOHead title={`Search: ${q}`} description={`Search results for ${q}`} path={`/search?q=${q}`} />
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <p className="section-eyebrow mb-2">Search</p>
        <h1 className="font-display text-3xl md:text-4xl mb-2">Search Results</h1>
        <p className="text-muted mb-8">{q ? `Showing results for "${q}"` : 'Enter a search term'}</p>
        {loading ? <LoadingSkeleton /> : products.length ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState title="No results found" description="Try different keywords." action={<Link to="/shop" className="text-gold-dark hover:underline">Browse All</Link>} />
        )}
      </div>
    </>
  );
}
