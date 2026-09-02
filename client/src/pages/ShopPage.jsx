import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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
import { categoryShowcase } from '../utils/brandConfig';
import { useTranslation } from '../hooks/useTranslation';

const shopCategories = categoryShowcase;

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const { t, tf, lang } = useTranslation();

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
  }, [searchParams, lang]);

  return (
    <>
      <SEOHead title={t('shop.seoTitle')} description={t('shop.seoDesc')} path="/shop" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14 bg-white">
        <Breadcrumbs items={[{ label: t('categories.jewellery') }]} />
        <header className="mb-8 md:mb-10">
          <p className="section-eyebrow">{t('shop.eyebrow')}</p>
          <h1>{t('shop.title')}</h1>
          <p className="type-section-desc prose-section mt-3">
            {t('shop.desc')}
          </p>
          {meta.total && (
            <p className="type-body-sm font-medium text-gold mt-2">
              {tf('shop.showing', { from: meta.showing, total: meta.total })}
            </p>
          )}
        </header>

        <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-border">
          <Link
            to="/shop"
            className="px-4 py-2 rounded-md text-sm bg-gold text-white font-medium"
          >
            {t('categories.all')}
          </Link>
          {shopCategories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop/${cat.slug}`}
              className="px-4 py-2 rounded-md text-sm bg-white hover:bg-cream border border-border hover:border-gold transition-colors text-charcoal"
            >
              {t(`categories.${cat.slug}`) || cat.name}
            </Link>
          ))}
        </div>

        <div className="flex gap-8">
          <ProductFilter filters={filters} onChange={updateFilters} />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-6">
              <button
                className="lg:hidden flex items-center gap-2 border border-gold/20 bg-white px-3 py-2 text-sm"
                onClick={() => setFilterOpen(true)}
              >
                <SlidersHorizontal size={16} /> {t('filters.title')}
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
                title={t('search.emptyTitle')}
                description={t('search.emptyDesc')}
                action={<Link to="/shop" className="text-gold-dark hover:underline">{t('common.viewAll')}</Link>}
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
