import { useEffect, useState } from 'react';
import { useSearchParams, Link, useParams } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductFilter from '../components/ProductFilter';
import ProductSort from '../components/ProductSort';
import ProductGrid from '../components/ProductGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { SlidersHorizontal } from 'lucide-react';
import { productCategories, purityOptions, seoKeywords } from '../utils/brandConfig';

export default function ProductsPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const sort = searchParams.get('sort') || 'featured';
  const page = searchParams.get('page') || '1';
  const categoryFromSlug = slug || searchParams.get('category') || '';

  const filters = {
    category: categoryFromSlug,
    subcategory: searchParams.get('subcategory') || '',
    purity: searchParams.get('purity') || '',
    goldColour: searchParams.get('goldColour') || '',
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
  }, [searchParams, slug]);

  const categoryLabel = productCategories.find((c) => c.slug === categoryFromSlug)?.label;
  const pageTitle = categoryLabel ? `${categoryLabel} — Gold Products` : 'Gold Product Catalogue';

  return (
    <>
      <SEOHead
        title={pageTitle}
        description="B2B gold product catalogue — chains and bangles in 14K, 18K and 22K. Request a quotation from Modern Gold."
        path={slug ? `/products/${slug}` : '/products'}
        keywords={seoKeywords}
      />

      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <Breadcrumbs items={[
          { label: 'Products', path: '/products' },
          ...(categoryLabel ? [{ label: categoryLabel }] : []),
        ]} />

        <header className="mb-8 md:mb-10">
          <p className="section-eyebrow mb-2">B2B Catalogue</p>
          <h1 className="headline-corporate headline-corporate-dark text-3xl md:text-4xl">
            {categoryLabel || 'Gold Product Catalogue'}
          </h1>
          <p className="text-muted text-sm md:text-base mt-3 max-w-2xl leading-relaxed">
            Professional gold chains and bangles for international business buyers. All pricing on request.
          </p>
          {meta.total != null && (
            <p className="text-sm text-gold-dark font-medium mt-2">
              Showing {meta.showing} of {meta.total} products
            </p>
          )}
        </header>

        <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-gold/10">
          <Link
            to="/products"
            className={`px-4 py-2 text-sm uppercase tracking-wider ${!categoryFromSlug ? 'bg-gold text-dark font-semibold' : 'border border-gold/20 hover:border-gold/40'}`}
          >
            All
          </Link>
          {productCategories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products/${cat.slug}`}
              className={`px-4 py-2 text-sm uppercase tracking-wider ${categoryFromSlug === cat.slug ? 'bg-gold text-dark font-semibold' : 'border border-gold/20 hover:border-gold/40'}`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {purityOptions.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => updateFilters({ ...filters, purity: filters.purity === p ? '' : p })}
              className={`px-3 py-1.5 text-xs tracking-wider uppercase border ${
                filters.purity === p ? 'bg-gold text-dark border-gold' : 'border-gold/20 hover:border-gold/40'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          <ProductFilter filters={filters} onChange={updateFilters} b2b />

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
                <ProductGrid products={products} variant="b2b" />
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
                description="Try adjusting your filters or browse all products."
                action={<Link to="/products" className="text-gold-dark hover:underline">View All Products</Link>}
              />
            )}
          </div>
        </div>
      </div>

      {filterOpen && (
        <ProductFilter filters={filters} onChange={updateFilters} mobile b2b onClose={() => setFilterOpen(false)} />
      )}
    </>
  );
}
