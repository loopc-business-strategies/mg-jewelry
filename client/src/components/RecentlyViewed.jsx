import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductGrid from './ProductGrid';
import LoadingSkeleton from './LoadingSkeleton';
import { useTranslation } from '../hooks/useTranslation';

export default function RecentlyViewed({ excludeId }) {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
      .filter((id) => id !== excludeId)
      .slice(0, 4);
    if (!ids.length) return;

    Promise.all(ids.map((id) => api.get(`/products/${id}`).then(({ data }) => data).catch(() => null)))
      .then((results) => setProducts(results.filter(Boolean)));
  }, [excludeId]);

  if (!products.length) return null;

  return (
    <section className="mt-16">
      <h2 className="type-card-title mb-6">{t('ui.recentlyViewed')}</h2>
      <ProductGrid products={products} />
    </section>
  );
}
