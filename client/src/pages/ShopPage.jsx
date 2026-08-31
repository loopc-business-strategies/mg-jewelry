import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductFilter from '../components/ProductFilter';
import ProductSort from '../components/ProductSort';
import ProductGrid from '../components/ProductGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import QuickViewModal from '../components/QuickViewModal';
import Pagination from '../components/Pagination';
import { SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);

  const sort = searchParams.get('sort') || 'featured';
  const page = searchParams.get('page') || '1';

  const filters = {
    category: searchParams.get('category') || '',
    subcategory: searchParams.get('subcategory') || '',
    gender: searchParams.get('gender') || '',
    metal: searchParams.get('metal') || '',
    purity: searchParams.get('purity') || '',
    occasion: searchParams.get('occasion') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    discount: searchParams.get('discount') || '',
    inStock: searchParams.get('inStock') || '',
  };

  const updateFilters = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([k, v]) => {
      v ? params.set(k, v) : params.delete(k);
    });
    params.delete('page');
    setSearchParams(params);
  };

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ ...filters, sort, page, limit: 24 });
    Object.keys(filters).forEach((k) => { if (!filters[k]) params.delete(k); });
    api.get(`/products?${params}`)
      .then(({ data }) => { setProducts(data.products); setMeta(data); })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <>
      <SEOHead title="Shop Jewellery" description="Browse our complete collection of premium gold and diamond jewellery." path="/shop" />

      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <Breadcrumbs items={[{ label: 'Jewellery' }]} />
        <header className="mb-8 md:mb-10">
          <p className="section-eyebrow mb-2">Collections</p>
          <h1 className="font-display text-3xl md:text-4xl text-charcoal">Jewellery</h1>
          {meta.total && (
            <p className="text-sm text-muted mt-2">
              Showing {meta.showing} of {meta.total} designs
            </p>
          )}
        </header>

        <div className="flex gap-8">
          <ProductFilter filters={filters} onChange={updateFilters} />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-6">
              <button
                className="lg:hidden flex items-center gap-2 border border-gold/20 bg-white px-3 py-2 text-sm"
                onClick={() => setFilterOpen(true)}
              >
                <SlidersHorizontal size={16} /> Filters
              </button>
              <ProductSort value={sort} onChange={(v) => {
                const params = new URLSearchParams(searchParams);
                params.set('sort', v);
                setSearchParams(params);
              }} />
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : products.length ? (
              <>
                <ProductGrid products={products} onQuickView={setQuickView} />
                <Pagination
                  page={Number(page)}
                  pages={meta.pages}
                  onChange={(p) => {
                    const params = new URLSearchParams(searchParams);
                    params.set('page', p);
                    setSearchParams(params);
                  }}
                />
              </>
            ) : (
              <EmptyState
                title="No products found"
                description="Try adjusting your filters or browse all jewellery."
                action={<Link to="/shop" className="text-gold-dark hover:underline">View All Products</Link>}
              />
            )}
          </div>
        </div>
      </div>

      {filterOpen && (
        <ProductFilter filters={filters} onChange={updateFilters} mobile onClose={() => setFilterOpen(false)} />
      )}

      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
    </>
  );
}
