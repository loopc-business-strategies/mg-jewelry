import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductFilter from '../components/ProductFilter';
import ProductSort from '../components/ProductSort';
import ProductGrid from '../components/ProductGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import QuickViewModal from '../components/QuickViewModal';
import Pagination from '../components/Pagination';
import SafeImage from '../components/SafeImage';
import { SlidersHorizontal } from 'lucide-react';
import { getCategoryImage } from '../utils/imageConfig';
import { useTranslation } from '../hooks/useTranslation';

export default function CategoryPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const { t, tf, lang } = useTranslation();

  const sort = searchParams.get('sort') || 'featured';
  const page = searchParams.get('page') || '1';
  const subcategory = searchParams.get('subcategory') || '';

  const filters = {
    gender: searchParams.get('gender') || '',
    metal: searchParams.get('metal') || '',
    purity: searchParams.get('purity') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    discount: searchParams.get('discount') || '',
    inStock: searchParams.get('inStock') || '',
  };

  useEffect(() => {
    api.get(`/categories/${slug}`).then(({ data }) => setCategory(data)).catch(() => {});
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ category: slug, sort, page, limit: 24, ...filters });
    if (subcategory) params.set('subcategory', subcategory);
    Object.keys(filters).forEach((k) => { if (!filters[k]) params.delete(k); });
    api.get(`/products?${params}`)
      .then(({ data }) => { setProducts(data.products); setMeta(data); })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [slug, searchParams, lang]);

  const title = category?.name || t(`categories.${slug}`) || slug?.replace(/-/g, ' ');
  const heroImage = getCategoryImage(slug);
  const heroAlt = `${title} — luxury gold jewelry editorial by Modern Gold Jewelry`;

  return (
    <>
      <SEOHead
        title={category?.seoTitle || title}
        description={category?.seoDescription || `Shop premium ${title} from Modern Gold Jewelry — international jewelry manufacturer.`}
        path={`/shop/${slug}`}
      />

      <div className="relative h-56 md:h-72 overflow-hidden bg-white">
        <SafeImage src={heroImage} alt={heroAlt} category={slug} className="w-full h-full object-cover" />
        <div className="absolute inset-0 editorial-hero-overlay flex items-end justify-center pb-8 md:pb-10">
          <h1 className="headline-editorial">{title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: t('common.shop'), path: '/shop' }, { label: title }]} />

        {category?.description && (
          <p className="type-section-desc prose-section mb-6">{category.description}</p>
        )}

        {category?.subcategories?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => { const p = new URLSearchParams(searchParams); p.delete('subcategory'); setSearchParams(p); }}
              className={`px-4 py-2 rounded-md text-sm border transition-colors ${!subcategory ? 'bg-gold text-white border-border' : 'bg-white hover:bg-gold/10 border-border'}`}
            >
              {t('categories.all')}
            </button>
            {category.subcategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => { const p = new URLSearchParams(searchParams); p.set('subcategory', sub.slug); setSearchParams(p); }}
                className={`px-4 py-2 rounded-md text-sm border transition-colors ${subcategory === sub.slug ? 'bg-gold text-white border-border' : 'bg-white hover:bg-gold/10 border-border'}`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          <ProductFilter filters={filters} onChange={(f) => {
            const params = new URLSearchParams(searchParams);
            Object.entries(f).forEach(([k, v]) => { v ? params.set(k, v) : params.delete(k); });
            setSearchParams(params);
          }} />

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted">{meta.total ? tf('shop.showing', { from: meta.showing, total: meta.total }) : ''}</p>
              <div className="flex gap-3">
                <button className="lg:hidden flex items-center gap-2 border rounded-lg px-3 py-2 text-sm" onClick={() => setFilterOpen(true)}>
                  <SlidersHorizontal size={16} /> {t('filters.title')}
                </button>
                <ProductSort value={sort} onChange={(v) => { const p = new URLSearchParams(searchParams); p.set('sort', v); setSearchParams(p); }} />
              </div>
            </div>

            {loading ? <LoadingSkeleton /> : (
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
            )}

            {category?.seoContent && (
              <div className="mt-12 p-6 bg-cream rounded-xl">
                <p className="text-sm text-muted leading-relaxed">{category.seoContent}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {filterOpen && (
        <ProductFilter filters={filters} onChange={(f) => {
          const params = new URLSearchParams(searchParams);
          Object.entries(f).forEach(([k, v]) => { v ? params.set(k, v) : params.delete(k); });
          setSearchParams(params);
        }} mobile onClose={() => setFilterOpen(false)} />
      )}

      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
    </>
  );
}
