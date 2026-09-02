import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import ProductGrid from '../components/ProductGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import { useTranslation } from '../hooks/useTranslation';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, tf, lang } = useTranslation();

  useEffect(() => {
    if (!q) { setProducts([]); setLoading(false); return; }
    setLoading(true);
    api.get(`/search?q=${encodeURIComponent(q)}&limit=24`)
      .then(({ data }) => setProducts(data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [q, lang]);

  return (
    <>
      <SEOHead title={tf('search.seoTitle', { q })} description={tf('search.seoDesc', { q })} path={`/search?q=${q}`} />
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <p className="section-eyebrow mb-2">{t('search.eyebrow')}</p>
        <h1 className="mb-2">{t('search.title')}</h1>
        <p className="text-muted mb-8">{q ? tf('search.showing', { q }) : t('search.enterTerm')}</p>
        {loading ? <LoadingSkeleton /> : products.length ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState title={t('search.emptyTitle')} description={t('search.emptyDesc')} action={<Link to="/shop" className="text-gold-dark hover:underline">{t('search.browseAll')}</Link>} />
        )}
      </div>
    </>
  );
}
